import Stripe from "stripe";

let stripeClient = null;

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY non configurata.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

export function getSiteUrlFromRequest(req) {
  const envSiteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").trim();

  if (envSiteUrl) {
    return envSiteUrl.replace(/\/+$/, "");
  }

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || "http";
  const host = String(req.headers.host || "localhost:3000").trim();

  return `${protocol}://${host}`.replace(/\/+$/, "");
}

export function buildEventPath(slug, locale = "it") {
  const normalizedLocale = locale === "en" ? "en" : "it";
  const localePrefix = normalizedLocale === "en" ? "/en" : "";
  return `${localePrefix}/eventi/${encodeURIComponent(slug)}`;
}
