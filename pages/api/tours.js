import crypto from "crypto";
import { getTourBySlug } from "../../utils/tours";
import { addMinutes, createCheckoutHold, getBlockingEntriesInRange, localDateTimeToIso } from "../../utils/tourCalendar";
import {
  TOUR_BOOKING_WINDOW,
  getTourPricePreset,
  getTourPricePresetLabel,
  minutesToTime,
  timeToMinutes,
} from "../../utils/tourPricing";
import { buildTourPath, getSiteUrlFromRequest, getStripeClient } from "../../utils/stripe";

function getRomeDateTimeParts(value) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function isValidTourStart(startsAt, durationMinutes) {
  const parts = getRomeDateTimeParts(startsAt);
  const startMinutes = Number(parts.hour) * 60 + Number(parts.minute);
  const windowStart = timeToMinutes(TOUR_BOOKING_WINDOW.startTime);
  const windowEnd = timeToMinutes(TOUR_BOOKING_WINDOW.endTime);

  return (
    startMinutes >= windowStart &&
    startMinutes + Number(durationMinutes) <= windowEnd &&
    (startMinutes - windowStart) % TOUR_BOOKING_WINDOW.stepMinutes === 0
  );
}

async function availability(req, res) {
  const locale = req.query.locale === "en" ? "en" : "it";
  const tour = await getTourBySlug(String(req.query.slug || ""), locale);
  if (!tour) return res.status(404).json({ error: "Tour non trovato." });
  const preset = getTourPricePreset(String(req.query.tariff || ""));
  const now = new Date();
  const noticeLimit = now.getTime() + Number(tour.minimum_notice_hours || 0) * 3600000;
  const result = [];
  const days = Math.min(365, Number(tour.booking_horizon_days || 180));
  const rangeEnd = new Date(now.getTime() + (days + 2) * 86400000).toISOString();
  const blockingEntries = await getBlockingEntriesInRange(now.toISOString(), rangeEnd);
  const blockingIntervals = blockingEntries.map((entry) => ({
    startsAt: new Date(entry.starts_at).getTime(),
    endsAt: new Date(entry.ends_at).getTime(),
  }));

  for (let offset = 0; offset <= days; offset += 1) {
    const day = new Date(now.getTime() + offset * 86400000);
    const dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(day);
    const slots = [];
    const windowStart = timeToMinutes(TOUR_BOOKING_WINDOW.startTime);
    const windowEnd = timeToMinutes(TOUR_BOOKING_WINDOW.endTime);
    for (
      let startMinutes = windowStart;
      startMinutes + preset.durationMinutes <= windowEnd;
      startMinutes += TOUR_BOOKING_WINDOW.stepMinutes
    ) {
      const startTime = minutesToTime(startMinutes);
      const endTime = minutesToTime(startMinutes + preset.durationMinutes);
      const startsAt = localDateTimeToIso(dateKey, startTime);
      if (new Date(startsAt).getTime() < noticeLimit) continue;
      const endsAt = addMinutes(startsAt, preset.durationMinutes);
      const slotStart = new Date(startsAt).getTime();
      const slotEnd = new Date(endsAt).getTime();
      const hasConflict = blockingIntervals.some(
        (entry) => entry.startsAt < slotEnd && entry.endsAt > slotStart,
      );
      if (!hasConflict) slots.push({ startsAt, endsAt, startTime, endTime });
    }
    if (slots.length) result.push({ date: dateKey, slots });
  }
  return res.status(200).json({ availability: result });
}

async function checkout(req, res) {
  const locale = req.body.locale === "en" ? "en" : "it";
  const tour = await getTourBySlug(String(req.body.slug || ""), locale);
  if (!tour) return res.status(404).json({ error: "Tour non trovato." });
  if (!req.body.termsAccepted) return res.status(400).json({ error: "Devi accettare i Termini e condizioni." });
  const preset = getTourPricePreset(String(req.body.tariff || ""));
  const tariffLabel = getTourPricePresetLabel(preset, locale);
  const startsAt = new Date(req.body.startsAt).toISOString();
  const attendeeCount = Math.max(1, Math.round(Number(req.body.attendeeCount || 1)));
  const duration = preset.durationMinutes;
  const noticeLimit = Date.now() + Number(tour.minimum_notice_hours || 0) * 3600000;
  if (new Date(startsAt).getTime() < noticeLimit || !isValidTourStart(startsAt, duration)) {
    return res.status(400).json({ error: "La fascia selezionata non e disponibile." });
  }
  const endsAt = addMinutes(startsAt, duration);
  const hold = await createCheckoutHold({ tour, startsAt, endsAt, metadata: { checkoutReference: crypto.randomUUID(), attendeeCount, tariff: preset.key, tariffLabel } });
  const amount = Number(preset.priceCents);
  const quantity = 1;
  const siteUrl = getSiteUrlFromRequest(req);
  const path = buildTourPath(tour.slug, locale);
  const session = await getStripeClient().checkout.sessions.create({
    mode: "payment", success_url: `${siteUrl}${path}?checkout=success`, cancel_url: `${siteUrl}${path}?checkout=cancel`,
    payment_method_types: ["card"],
    line_items: [{ quantity, price_data: { currency: tour.currency || "eur", unit_amount: amount, product_data: { name: tour.title, description: `${tariffLabel} · ${startsAt} - ${duration} minuti` } } }],
    metadata: { productType: "tour", tourSlug: tour.slug, tourStartsAt: startsAt, tourEndsAt: endsAt, calendarEntryId: String(hold.id), attendeeCount: String(attendeeCount), tariff: preset.key, tariffLabel, locale },
    payment_intent_data: { metadata: { productType: "tour", tourSlug: tour.slug, calendarEntryId: String(hold.id) } },
  });
  return res.status(200).json({ url: session.url });
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET" && req.query.action === "availability") return await availability(req, res);
    if (req.method === "POST" && req.query.action === "checkout") return await checkout(req, res);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Operazione tour non riuscita." });
  }
}
