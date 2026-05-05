import nodemailer from "nodemailer";
import crypto from "crypto";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { supabaseAdmin } from "../../../utils/supabaseAdmin";
import {
  getStripeClient,
  getStripeWebhookSecret,
} from "../../../utils/stripe";

const MAX_EVENT_CAPACITY = 10;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
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

function getSessionAttendeeCount(session) {
  return parsePositiveInt(session?.metadata?.attendeeCount, 1) || 1;
}

function hasNewsletterConsent(session) {
  return (
    String(session?.metadata?.newsletterConsent || "").trim().toLowerCase() === "true"
  );
}

function getMailchimpConfig() {
  const apiKey = String(process.env.MAILCHIMP_API_KEY || "").trim();
  const server = String(process.env.MAILCHIMP_SERVER_PREFIX || "us14").trim();
  const audienceId = String(
    process.env.MAILCHIMP_AUDIENCE_ID || "5f51338f71",
  ).trim();
  const permissionId = String(
    process.env.MAILCHIMP_MARKETING_PERMISSION_ID || "",
  ).trim();

  return { apiKey, server, audienceId, permissionId };
}

async function subscribeToNewsletterIfConsented(session) {
  if (!hasNewsletterConsent(session)) return;

  const email =
    String(session?.customer_details?.email || "").trim().toLowerCase() ||
    String(session?.customer_email || "").trim().toLowerCase();

  if (!email) {
    console.warn("[stripe-webhook] newsletter opt-in true but no customer email.");
    return;
  }

  const { apiKey, server, audienceId, permissionId } = getMailchimpConfig();

  if (!apiKey || !server || !audienceId) {
    console.warn(
      "[stripe-webhook] missing Mailchimp env (MAILCHIMP_API_KEY / MAILCHIMP_SERVER_PREFIX / MAILCHIMP_AUDIENCE_ID).",
    );
    return;
  }

  mailchimp.setConfig({ apiKey, server });

  const subscriberHash = crypto
    .createHash("md5")
    .update(email)
    .digest("hex");

  const marketingPermissions = permissionId
    ? [{ marketing_permission_id: permissionId, enabled: true }]
    : undefined;

  try {
    await mailchimp.lists.setListMember(audienceId, subscriberHash, {
      email_address: email,
      status_if_new: "pending",
      status: "subscribed",
      tags: ["checkout-event", "newsletter-optin"],
      marketing_permissions: marketingPermissions,
    });
  } catch (error) {
    console.warn(
      `[stripe-webhook] Mailchimp subscribe failed for ${email}: ${error.message}`,
    );
  }
}

async function getBookedSeats(eventSlug, eventDateIso, sessionIdToExclude = "") {
  const { data, error } = await supabaseAdmin
    .from("event_bookings")
    .select("stripe_session_id,raw_payload,payment_status")
    .eq("event_slug", eventSlug)
    .eq("event_date_iso", eventDateIso)
    .eq("payment_status", "paid");

  if (error) {
    throw new Error(`Errore lettura disponibilita webhook: ${error.message}`);
  }

  return (data || [])
    .filter((booking) => booking.stripe_session_id !== sessionIdToExclude)
    .reduce((sum, booking) => sum + getBookingAttendeeCount(booking), 0);
}

async function sendPaymentNotification(session) {
  const smtpUser = process.env.SMTP_USER || "luisaquaglia.tourguide@gmail.com";
  const smtpPass = process.env.SMTP_PASSWORD || "fvbuprlorshulfzk";
  const destination = process.env.PAYMENT_NOTIFICATION_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass || !destination) {
    return;
  }

  const attendeeNamesRaw = String(session.metadata?.attendeeNames || "").trim();
  const attendeeNames = attendeeNamesRaw
    ? attendeeNamesRaw
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(", ")
    : "Nomi non inseriti";

  const amountTotal = Number(session.amount_total || 0) / 100;
  const currency = String(session.currency || "eur").toUpperCase();
  const eventSlug = String(session.metadata?.eventSlug || "-");
  const eventDateIso = String(session.metadata?.eventDateIso || "-");
  const attendeeCount = getSessionAttendeeCount(session);
  const newsletterConsent = hasNewsletterConsent(session);
  const customerEmail =
    String(session.customer_details?.email || "").trim() ||
    String(session.customer_email || "").trim() ||
    "-";

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpUser,
    to: destination,
    subject: `Nuovo pagamento evento: ${eventSlug}`,
    html: `
      <div style="font-size:16px;line-height:1.5;">
        <h3>Nuovo pagamento ricevuto</h3>
        <p><strong>Evento:</strong> ${eventSlug}</p>
        <p><strong>Data:</strong> ${eventDateIso}</p>
        <p><strong>Partecipanti:</strong> ${attendeeCount}</p>
        <p><strong>Nomi:</strong> ${attendeeNames}</p>
        <p><strong>Importo:</strong> ${amountTotal.toFixed(2)} ${currency}</p>
        <p><strong>Email cliente:</strong> ${customerEmail}</p>
        <p><strong>Consenso newsletter:</strong> ${newsletterConsent ? "Si" : "No"}</p>
        <p><strong>Sessione Stripe:</strong> ${session.id}</p>
      </div>
    `,
  });
}

async function persistBookingFromSession(session) {
  if (!session || !session.id) {
    throw new Error("Sessione Stripe non valida.");
  }

  const eventSlug = String(session.metadata?.eventSlug || "").trim();
  const eventDateIso = String(session.metadata?.eventDateIso || "").trim();

  if (!eventSlug || !eventDateIso) {
    throw new Error(
      "Metadata mancanti: eventSlug/eventDateIso non presenti nella sessione.",
    );
  }

  const attendeeCount = getSessionAttendeeCount(session);
  const eventCapacity = Math.max(
    1,
    Math.min(
      MAX_EVENT_CAPACITY,
      parsePositiveInt(session.metadata?.eventCapacity, MAX_EVENT_CAPACITY),
    ),
  );
  const bookedSeats = await getBookedSeats(eventSlug, eventDateIso, session.id);

  if (bookedSeats + attendeeCount > eventCapacity) {
    throw new Error(
      `Capienza superata (${bookedSeats}/${eventCapacity}) per ${eventSlug} ${eventDateIso}.`,
    );
  }

  const record = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: String(session.payment_intent || ""),
    event_slug: eventSlug,
    event_date_iso: eventDateIso,
    customer_email:
      String(session.customer_details?.email || "").trim() ||
      String(session.customer_email || "").trim(),
    amount_total: Number(session.amount_total || 0),
    currency: String(session.currency || "eur").toLowerCase(),
    payment_status: String(session.payment_status || "paid"),
    raw_payload: session,
  };

  const { error } = await supabaseAdmin
    .from("event_bookings")
    .upsert(record, { onConflict: "stripe_session_id" });

  if (error) {
    throw new Error(`Booking upsert failed: ${error.message}`);
  }

  await subscribeToNewsletterIfConsented(session);

  await sendPaymentNotification(session);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    if (!webhookSecret) {
      return res
        .status(500)
        .json({ error: "STRIPE_WEBHOOK_SECRET non configurata." });
    }

    const signature = req.headers["stripe-signature"];

    if (!signature || Array.isArray(signature)) {
      return res.status(400).json({ error: "Firma Stripe mancante." });
    }

    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      await persistBookingFromSession(event.data.object);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook] error:", error.message);
    return res.status(400).json({ error: error.message || "Webhook error." });
  }
}
