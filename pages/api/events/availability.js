import { getEventBySlug } from "../../../utils/events";
import {
  getBookingAttendeeCount,
  isCountableBooking,
  parsePositiveInt,
} from "../../../utils/eventBookings";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";

const MAX_EVENT_CAPACITY = 10;

async function getBookedSeats(eventSlug, eventDateIso) {
  const { data, error } = await supabaseAdmin
    .from("event_bookings")
    .select("raw_payload,payment_status,stripe_session_id,stripe_payment_intent_id")
    .eq("event_slug", eventSlug)
    .eq("event_date_iso", eventDateIso)
    .eq("payment_status", "paid");

  if (error) {
    throw new Error(`Errore lettura disponibilita: ${error.message}`);
  }

  return (data || [])
    .filter(isCountableBooking)
    .reduce((sum, booking) => sum + getBookingAttendeeCount(booking), 0);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slug = String(req.query?.slug || "").trim();
    const locale = req.query?.locale === "en" ? "en" : "it";

    if (!slug) {
      return res.status(400).json({ error: "Slug obbligatorio." });
    }

    const event = await getEventBySlug(slug, locale);

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato." });
    }

    const dates = await Promise.all(
      (event.dates || []).map(async (date) => {
        const capacity = Math.max(
          1,
          Math.min(
            MAX_EVENT_CAPACITY,
            parsePositiveInt(date.spots, MAX_EVENT_CAPACITY),
          ),
        );
        const booked = await getBookedSeats(slug, date.iso);

        return {
          iso: date.iso,
          capacity,
          booked,
          remaining: Math.max(0, capacity - booked),
        };
      }),
    );

    return res.status(200).json({ dates });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Errore nel caricamento disponibilita.",
    });
  }
}
