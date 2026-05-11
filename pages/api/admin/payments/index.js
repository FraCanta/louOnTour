import { requireAdminApiKey } from "../../../../utils/adminAuth";
import { getAdminEventBySlug } from "../../../../utils/events";
import {
  getBookingAttendeeCount,
  isCountableBooking,
  parsePositiveInt,
} from "../../../../utils/eventBookings";
import { supabaseAdmin } from "../../../../utils/supabaseAdmin";

const MAX_EVENT_CAPACITY = 10;

function parseAmountCents(value) {
  const normalized = String(value || "")
    .trim()
    .replace(",", ".");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed * 100);
}

function normalizeAttendeeNames(value) {
  return String(value || "")
    .split(/[\n,|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" | ")
    .slice(0, 400);
}

function normalizeManualPaymentStatus(value) {
  const status = String(value || "")
    .trim()
    .toLowerCase();

  return status === "pending" ? "pending" : "paid";
}

function isManualBooking(booking) {
  const sessionId = String(
    booking?.stripe_session_id || booking?.raw_payload?.id || "",
  ).trim();
  const metadata = booking?.raw_payload?.metadata || {};

  return (
    sessionId.startsWith("manual_") ||
    String(metadata.manualBooking || "").toLowerCase() === "true"
  );
}

async function getBookedSeats(eventSlug, eventDateIso, excludeSessionId = "") {
  const { data, error } = await supabaseAdmin
    .from("event_bookings")
    .select("raw_payload,payment_status,stripe_session_id,stripe_payment_intent_id")
    .eq("event_slug", eventSlug)
    .eq("event_date_iso", eventDateIso);

  if (error) {
    throw new Error(`Errore lettura disponibilita: ${error.message}`);
  }

  return (data || [])
    .filter((booking) => booking.stripe_session_id !== excludeSessionId)
    .filter(isCountableBooking)
    .reduce((sum, booking) => sum + getBookingAttendeeCount(booking), 0);
}

export default async function handler(req, res) {
  if (!(await requireAdminApiKey(req, res))) {
    return;
  }

  if (!["GET", "POST", "PATCH"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (req.method === "POST") {
      const eventSlug = String(req.body?.eventSlug || "").trim();
      const eventDateIso = String(req.body?.eventDateIso || "").trim();
      const customerEmail = String(req.body?.customerEmail || "").trim();
      const attendeeCount = Math.max(
        1,
        Math.min(
          MAX_EVENT_CAPACITY,
          parsePositiveInt(req.body?.attendeeCount, 1),
        ),
      );
      const attendeeNames = normalizeAttendeeNames(req.body?.attendeeNames);
      const amountTotal = parseAmountCents(req.body?.amountEuro);
      const paymentStatus = normalizeManualPaymentStatus(
        req.body?.paymentStatus,
      );
      const note = String(req.body?.note || "").trim();

      if (!eventSlug || !eventDateIso) {
        return res
          .status(400)
          .json({ error: "Evento e data sono obbligatori." });
      }

      const event = await getAdminEventBySlug(eventSlug);
      const date = (event?.dates || []).find((item) => item.iso === eventDateIso);

      if (!event || !date) {
        return res.status(404).json({ error: "Evento o data non trovati." });
      }

      const dateCapacity = Math.max(
        1,
        Math.min(MAX_EVENT_CAPACITY, parsePositiveInt(date.spots, MAX_EVENT_CAPACITY)),
      );
      const bookedSeats = await getBookedSeats(eventSlug, eventDateIso);
      const remainingSeats = Math.max(0, dateCapacity - bookedSeats);

      if (attendeeCount > remainingSeats) {
        return res.status(400).json({
          error: `Posti disponibili insufficienti. Rimasti: ${remainingSeats}.`,
        });
      }

      const createdAt = new Date().toISOString();
      const sessionId = `manual_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const rawPayload = {
        id: sessionId,
        object: "manual_booking",
        created_at: createdAt,
        livemode: true,
        metadata: {
          manualBooking: "true",
          paymentMethod: "bank_transfer",
          eventSlug,
          eventDateIso,
          eventDateLabel: date.labelIt || eventDateIso,
          attendeeCount: String(attendeeCount),
          attendeeNames,
          note,
          paymentStatus,
          createdBy: "admin",
        },
        customer_details: {
          email: customerEmail,
        },
      };

      const { data, error } = await supabaseAdmin
        .from("event_bookings")
        .insert({
          stripe_session_id: sessionId,
          stripe_payment_intent_id: "",
          event_slug: eventSlug,
          event_date_iso: eventDateIso,
          customer_email: customerEmail,
          amount_total: amountTotal,
          currency: "eur",
          payment_status: paymentStatus,
          raw_payload: rawPayload,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return res.status(201).json({ payment: data });
    }

    if (req.method === "PATCH") {
      const stripeSessionId = String(req.body?.stripeSessionId || "").trim();
      const hasExcluded = Object.prototype.hasOwnProperty.call(
        req.body || {},
        "excluded",
      );
      const hasPaymentStatus = Object.prototype.hasOwnProperty.call(
        req.body || {},
        "paymentStatus",
      );
      const hasManualDetails = Object.prototype.hasOwnProperty.call(
        req.body || {},
        "manualDetails",
      );
      const excluded = Boolean(req.body?.excluded);
      const paymentStatus = normalizeManualPaymentStatus(
        req.body?.paymentStatus,
      );
      const manualDetails =
        req.body?.manualDetails && typeof req.body.manualDetails === "object"
          ? req.body.manualDetails
          : {};

      if (!stripeSessionId) {
        return res.status(400).json({ error: "Sessione Stripe obbligatoria." });
      }

      if (!hasExcluded && !hasPaymentStatus && !hasManualDetails) {
        return res.status(400).json({ error: "Nessuna modifica richiesta." });
      }

      const { data: existing, error: readError } = await supabaseAdmin
        .from("event_bookings")
        .select("*")
        .eq("stripe_session_id", stripeSessionId)
        .single();

      if (readError) {
        throw new Error(readError.message);
      }

      const rawPayload =
        existing?.raw_payload && typeof existing.raw_payload === "object"
          ? existing.raw_payload
          : {};
      const metadata =
        rawPayload.metadata && typeof rawPayload.metadata === "object"
          ? rawPayload.metadata
          : {};
      const nextMetadata = { ...metadata };

      if (hasExcluded) {
        if (excluded) {
          nextMetadata.testBooking = "true";
          nextMetadata.adminExcludedFromCounts = "true";
        } else {
          delete nextMetadata.testBooking;
          delete nextMetadata.adminExcludedFromCounts;
        }
      }

      if ((hasPaymentStatus || hasManualDetails) && !isManualBooking(existing)) {
        return res
          .status(400)
          .json({ error: "Solo le prenotazioni manuali sono modificabili." });
      }

      if (hasPaymentStatus) {
        nextMetadata.paymentStatus = paymentStatus;
      }

      const nextPaymentStatus = hasPaymentStatus
        ? paymentStatus
        : existing.payment_status;
      const nextAttendeeCount = hasManualDetails
        ? Math.max(
            1,
            Math.min(
              MAX_EVENT_CAPACITY,
              parsePositiveInt(
                manualDetails.attendeeCount,
                getBookingAttendeeCount(existing),
              ),
            ),
          )
        : getBookingAttendeeCount(existing);

      if (hasManualDetails) {
        const customerEmail = String(manualDetails.customerEmail || "").trim();
        const attendeeNames = normalizeAttendeeNames(
          manualDetails.attendeeNames,
        );
        const note = String(manualDetails.note || "").trim();

        nextMetadata.attendeeCount = String(nextAttendeeCount);
        nextMetadata.attendeeNames = attendeeNames;
        nextMetadata.note = note;
        nextMetadata.paymentStatus = nextPaymentStatus;

        rawPayload.customer_details = {
          ...(rawPayload.customer_details || {}),
          email: customerEmail,
        };
      }

      if (nextPaymentStatus === "paid" && !isTestBooking({
        ...existing,
        payment_status: nextPaymentStatus,
        raw_payload: {
          ...rawPayload,
          metadata: nextMetadata,
        },
      })) {
        const event = await getAdminEventBySlug(existing.event_slug);
        const date = (event?.dates || []).find(
          (item) => item.iso === existing.event_date_iso,
        );

        if (!event || !date) {
          return res.status(404).json({ error: "Evento o data non trovati." });
        }

        const dateCapacity = Math.max(
          1,
          Math.min(
            MAX_EVENT_CAPACITY,
            parsePositiveInt(date.spots, MAX_EVENT_CAPACITY),
          ),
        );
        const bookedSeats = await getBookedSeats(
          existing.event_slug,
          existing.event_date_iso,
          stripeSessionId,
        );
        const remainingSeats = Math.max(0, dateCapacity - bookedSeats);

        if (nextAttendeeCount > remainingSeats) {
          return res.status(400).json({
            error: `Posti disponibili insufficienti. Rimasti: ${remainingSeats}.`,
          });
        }
      }

      const updatePayload = {
        raw_payload: {
          ...rawPayload,
          metadata: nextMetadata,
        },
      };

      if (hasPaymentStatus) {
        updatePayload.payment_status = paymentStatus;
      }

      if (hasManualDetails) {
        updatePayload.customer_email = String(
          manualDetails.customerEmail || "",
        ).trim();
        updatePayload.amount_total = parseAmountCents(
          manualDetails.amountEuro,
        );
      }

      const { data, error } = await supabaseAdmin
        .from("event_bookings")
        .update(updatePayload)
        .eq("stripe_session_id", stripeSessionId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return res.status(200).json({ payment: data });
    }

    const { data, error } = await supabaseAdmin
      .from("event_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ payments: data || [] });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Errore nel caricamento pagamenti." });
  }
}
