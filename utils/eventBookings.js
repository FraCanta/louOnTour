export function parsePositiveInt(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.round(parsed));
}

export function getBookingAttendeeCount(booking) {
  const fromMetadata = parsePositiveInt(
    booking?.raw_payload?.metadata?.attendeeCount,
    0,
  );

  if (fromMetadata > 0) {
    return fromMetadata;
  }

  return 1;
}

export function isTestBooking(booking) {
  const sessionId = String(
    booking?.stripe_session_id || booking?.raw_payload?.id || "",
  ).trim();
  const paymentIntentId = String(
    booking?.stripe_payment_intent_id || booking?.raw_payload?.payment_intent || "",
  ).trim();
  const metadata = booking?.raw_payload?.metadata || {};
  const explicitTestFlag = String(
    metadata.testBooking || metadata.isTest || metadata.test || "",
  )
    .trim()
    .toLowerCase();

  return (
    booking?.raw_payload?.livemode === false ||
    sessionId.startsWith("cs_test_") ||
    paymentIntentId.startsWith("pi_test_") ||
    ["1", "true", "yes"].includes(explicitTestFlag)
  );
}

export function isCountableBooking(booking) {
  return booking?.payment_status === "paid" && !isTestBooking(booking);
}
