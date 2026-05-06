import { getEventBySlug } from "../../../utils/events";
import {
  buildEventPath,
  getSiteUrlFromRequest,
  getStripeClient,
} from "../../../utils/stripe";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";

const MAX_EVENT_CAPACITY = 10;

function buildCheckoutLineDescription(date, locale) {
  const lang = locale === "en" ? "en" : "it";
  const label = lang === "en" ? date.labelEn : date.labelIt;
  const time = String(date.time || "").trim();
  const location = String(date.location || "").trim();
  return [label, time, location].filter(Boolean).join(" | ");
}

function parsePositiveInt(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.round(parsed));
}

function getBookingAttendeeCount(booking) {
  const fromMetadata = parsePositiveInt(
    booking?.raw_payload?.metadata?.attendeeCount,
    0,
  );

  if (fromMetadata > 0) {
    return fromMetadata;
  }

  return 1;
}

async function getBookedSeats(eventSlug, eventDateIso) {
  const { data, error } = await supabaseAdmin
    .from("event_bookings")
    .select("raw_payload,payment_status")
    .eq("event_slug", eventSlug)
    .eq("event_date_iso", eventDateIso)
    .eq("payment_status", "paid");

  if (error) {
    throw new Error(`Errore lettura disponibilita: ${error.message}`);
  }

  return (data || []).reduce(
    (sum, booking) => sum + getBookingAttendeeCount(booking),
    0,
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slug = String(req.body?.slug || "").trim();
    const dateIso = String(req.body?.dateIso || "").trim();
    const locale = req.body?.locale === "en" ? "en" : "it";
    const parsedQuantity = Number(req.body?.quantity || 1);
    const quantity = Number.isFinite(parsedQuantity)
      ? Math.max(1, Math.min(MAX_EVENT_CAPACITY, Math.round(parsedQuantity)))
      : 1;
    const attendeeNames = Array.isArray(req.body?.attendeeNames)
      ? req.body.attendeeNames
          .map((item) => String(item || "").trim())
          .filter(Boolean)
          .slice(0, quantity)
      : [];
    const newsletterConsent = Boolean(req.body?.newsletterConsent);

    if (!slug || !dateIso) {
      return res.status(400).json({ error: "Slug e data sono obbligatori." });
    }

    const event = await getEventBySlug(slug, locale);

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato." });
    }

    const date = (event.dates || []).find((item) => item.iso === dateIso);

    if (!date) {
      return res.status(404).json({ error: "Data evento non trovata." });
    }

    const stripeEnabled = Boolean(date.stripe?.enabled);
    const priceCents = Number(date.stripe?.priceCents || 0);
    const currency = String(date.stripe?.currency || "eur")
      .trim()
      .toLowerCase();

    if (!stripeEnabled || priceCents <= 0) {
      return res.status(400).json({
        error: "Pagamento online non configurato per questa data.",
      });
    }

    const dateCapacity = Math.max(
      1,
      Math.min(MAX_EVENT_CAPACITY, parsePositiveInt(date.spots, MAX_EVENT_CAPACITY)),
    );
    const bookedSeats = await getBookedSeats(slug, dateIso);
    const remainingSeats = Math.max(0, dateCapacity - bookedSeats);

    if (remainingSeats <= 0) {
      return res.status(400).json({
        error: "Posti esauriti per questa data.",
      });
    }

    if (quantity > remainingSeats) {
      return res.status(400).json({
        error: `Posti disponibili insufficienti. Rimasti: ${remainingSeats}.`,
      });
    }

    const stripe = getStripeClient();
    const siteUrl = getSiteUrlFromRequest(req);
    const eventPath = buildEventPath(slug, locale);
    const successUrl = `${siteUrl}${eventPath}?checkout=success`;
    const cancelUrl = `${siteUrl}${eventPath}?checkout=cancel`;
    const dateLabel = locale === "en" ? date.labelEn || dateIso : date.labelIt || dateIso;
    const attendeeNamesPayload = attendeeNames.join(" | ").slice(0, 400);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      line_items: [
        {
          quantity,
          price_data: {
            currency,
            unit_amount: priceCents,
            product_data: {
              name: event.title || slug,
              description: buildCheckoutLineDescription(date, locale),
            },
          },
        },
      ],
      metadata: {
        eventSlug: slug,
        eventDateIso: dateIso,
        eventDateLabel: dateLabel,
        attendeeCount: String(quantity),
        eventCapacity: String(dateCapacity),
        remainingBeforeCheckout: String(remainingSeats),
        attendeeNames: attendeeNamesPayload,
        newsletterConsent: newsletterConsent ? "true" : "false",
        locale,
      },
      payment_intent_data: {
        metadata: {
          eventSlug: slug,
          eventDateIso: dateIso,
          eventDateLabel: dateLabel,
          attendeeCount: String(quantity),
          attendeeNames: attendeeNamesPayload,
          newsletterConsent: newsletterConsent ? "true" : "false",
          locale,
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Errore durante la creazione del checkout.",
    });
  }
}
