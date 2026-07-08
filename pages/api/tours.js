import crypto from "crypto";
import { getTourBySlug } from "../../utils/tours";
import { addMinutes, createCheckoutHold, getBlockingEntriesInRange, localDateTimeToIso } from "../../utils/tourCalendar";
import { buildTourPath, getSiteUrlFromRequest, getStripeClient } from "../../utils/stripe";

async function availability(req, res) {
  const locale = req.query.locale === "en" ? "en" : "it";
  const tour = await getTourBySlug(String(req.query.slug || ""), locale);
  if (!tour) return res.status(404).json({ error: "Tour non trovato." });
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
    for (const rule of tour.availability_rules || []) {
      const startsAt = localDateTimeToIso(dateKey, rule.startTime);
      if (new Date(startsAt).getTime() < noticeLimit) continue;
      const endsAt = addMinutes(startsAt, tour.duration_minutes);
      const slotStart = new Date(startsAt).getTime();
      const slotEnd = new Date(endsAt).getTime();
      const hasConflict = blockingIntervals.some(
        (entry) => entry.startsAt < slotEnd && entry.endsAt > slotStart,
      );
      if (!hasConflict) slots.push({ startsAt, endsAt, startTime: rule.startTime, endTime: rule.endTime });
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
  const startsAt = new Date(req.body.startsAt).toISOString();
  const extensionSelected = Boolean(req.body.extensionSelected && tour.extension_enabled);
  const attendeeCount = Math.max(1, Math.round(Number(req.body.attendeeCount || 1)));
  const duration = Number(tour.duration_minutes) + (extensionSelected ? Number(tour.extension_minutes) : 0);
  const endsAt = addMinutes(startsAt, duration);
  const hold = await createCheckoutHold({ tour, startsAt, endsAt, metadata: { checkoutReference: crypto.randomUUID(), extensionSelected, attendeeCount } });
  const amount = Number(tour.base_price_cents) + (extensionSelected ? Number(tour.extension_price_cents) : 0);
  const quantity = tour.price_mode === "per_person" ? attendeeCount : 1;
  const siteUrl = getSiteUrlFromRequest(req);
  const path = buildTourPath(tour.slug, locale);
  const session = await getStripeClient().checkout.sessions.create({
    mode: "payment", success_url: `${siteUrl}${path}?checkout=success`, cancel_url: `${siteUrl}${path}?checkout=cancel`,
    payment_method_types: ["card"],
    line_items: [{ quantity, price_data: { currency: tour.currency || "eur", unit_amount: amount, product_data: { name: tour.title, description: `${startsAt} - ${duration} minuti` } } }],
    metadata: { productType: "tour", tourSlug: tour.slug, tourStartsAt: startsAt, tourEndsAt: endsAt, calendarEntryId: String(hold.id), attendeeCount: String(attendeeCount), extensionSelected: String(extensionSelected), locale },
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
