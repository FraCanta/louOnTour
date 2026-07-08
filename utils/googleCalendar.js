import crypto from "crypto";
import { supabaseAdmin } from "./supabaseAdmin";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_ROOT = "https://www.googleapis.com/calendar/v3";
const SCOPE = "https://www.googleapis.com/auth/calendar.events";

function config() {
  const clientId = String(process.env.GOOGLE_CALENDAR_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.GOOGLE_CALENDAR_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) throw new Error("Credenziali Google Calendar non configurate.");
  return { clientId, clientSecret };
}

export function getGoogleRedirectUri() {
  const explicit = String(process.env.GOOGLE_CALENDAR_REDIRECT_URI || "").trim();
  const site = String(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  return explicit || `${site}/api/admin/google-calendar?action=callback`;
}

function stateSecret() {
  return String(process.env.GOOGLE_OAUTH_STATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "");
}

export function createGoogleOAuthState() {
  const payload = Buffer.from(JSON.stringify({ createdAt: Date.now() })).toString("base64url");
  const signature = crypto.createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyGoogleOAuthState(state) {
  const [payload, signature] = String(state || "").split(".");
  if (!payload || !signature || !stateSecret()) return false;
  const expected = crypto.createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  return Date.now() - Number(parsed.createdAt) < 15 * 60 * 1000;
}

export function buildGoogleAuthorizationUrl() {
  const { clientId } = config();
  const params = new URLSearchParams({
    client_id: clientId, redirect_uri: getGoogleRedirectUri(), response_type: "code",
    scope: SCOPE, access_type: "offline", prompt: "consent", include_granted_scopes: "true",
    state: createGoogleOAuthState(),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function tokenRequest(body) {
  const response = await fetch(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.error || "Autorizzazione Google non riuscita.");
  return data;
}

export async function exchangeGoogleCode(code) {
  const { clientId, clientSecret } = config();
  const tokens = await tokenRequest({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: getGoogleRedirectUri(), grant_type: "authorization_code" });
  if (!tokens.refresh_token) throw new Error("Google non ha restituito il refresh token. Revoca l'accesso e riprova.");
  const { data: existing } = await supabaseAdmin.from("google_calendar_connections").select("id").limit(1).maybeSingle();
  const payload = { refresh_token: tokens.refresh_token, scope: tokens.scope || SCOPE, updated_at: new Date().toISOString() };
  const query = existing
    ? supabaseAdmin.from("google_calendar_connections").update(payload).eq("id", existing.id)
    : supabaseAdmin.from("google_calendar_connections").insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
}

async function connection() {
  const { data, error } = await supabaseAdmin.from("google_calendar_connections").select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Google Calendar non collegato.");
  return data;
}

async function accessToken(conn) {
  const { clientId, clientSecret } = config();
  const tokens = await tokenRequest({ client_id: clientId, client_secret: clientSecret, refresh_token: conn.refresh_token, grant_type: "refresh_token" });
  return tokens.access_token;
}

async function googleFetch(path, options = {}) {
  const conn = await connection();
  const token = await accessToken(conn);
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = response.status === 204 ? {} : await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Google Calendar API error.");
  return { data, conn };
}

export async function getGoogleCalendarStatus() {
  const { data, error } = await supabaseAdmin.from("google_calendar_connections")
    .select("id,owner_email,calendar_id,channel_expiration,updated_at").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return { connected: Boolean(data), connection: data || null };
}

export async function pushCalendarEntryToGoogle(entryId) {
  const { data: entry, error } = await supabaseAdmin.from("calendar_entries").select("*").eq("id", entryId).single();
  if (error) throw new Error(error.message);
  const body = {
    summary: entry.title,
    description: "Gestito da Lou On Tour",
    start: { dateTime: entry.starts_at, timeZone: "Europe/Rome" },
    end: { dateTime: entry.ends_at, timeZone: "Europe/Rome" },
    extendedProperties: { private: { louOnTourEntryId: String(entry.id), sourceType: entry.source_type } },
  };
  const conn = await connection();
  const calendarId = encodeURIComponent(conn.calendar_id || "primary");
  const path = entry.google_event_id
    ? `/calendars/${calendarId}/events/${encodeURIComponent(entry.google_event_id)}`
    : `/calendars/${calendarId}/events`;
  const { data } = await googleFetch(path, { method: entry.google_event_id ? "PUT" : "POST", body: JSON.stringify(body) });
  await supabaseAdmin.from("calendar_entries").update({ google_event_id: data.id, google_updated_at: data.updated, updated_at: new Date().toISOString() }).eq("id", entry.id);
  return data;
}

export async function deleteCalendarEntryFromGoogle(googleEventId) {
  if (!googleEventId) return;
  const conn = await connection();
  const calendarId = encodeURIComponent(conn.calendar_id || "primary");
  await googleFetch(`/calendars/${calendarId}/events/${encodeURIComponent(googleEventId)}`, { method: "DELETE" });
}

export async function syncGoogleCalendar() {
  const conn = await connection();
  const calendarId = encodeURIComponent(conn.calendar_id || "primary");
  const params = new URLSearchParams({ singleEvents: "true", showDeleted: "true", maxResults: "2500", timeMin: new Date(Date.now() - 86400000).toISOString(), timeMax: new Date(Date.now() + 366 * 86400000).toISOString() });
  const { data } = await googleFetch(`/calendars/${calendarId}/events?${params}`);
  let imported = 0;
  for (const event of data.items || []) {
    const localId = Number(event.extendedProperties?.private?.louOnTourEntryId || 0);
    const startsAt = event.start?.dateTime || (event.start?.date ? `${event.start.date}T00:00:00.000Z` : null);
    const endsAt = event.end?.dateTime || (event.end?.date ? `${event.end.date}T00:00:00.000Z` : null);
    const payload = {
      source_type: localId ? (event.extendedProperties?.private?.sourceType || "tour_booking") : "google",
      source_id: event.id, title: event.summary || "Impegno Google Calendar",
      starts_at: startsAt, ends_at: endsAt, status: event.status === "cancelled" ? "cancelled" : "confirmed",
      google_event_id: event.id, google_updated_at: event.updated, updated_at: new Date().toISOString(),
      metadata: { htmlLink: event.htmlLink || "", allDay: Boolean(event.start?.date) },
    };
    if (!startsAt || !endsAt) continue;
    const query = localId
      ? supabaseAdmin.from("calendar_entries").update(payload).eq("id", localId)
      : supabaseAdmin.from("calendar_entries").upsert(payload, { onConflict: "google_event_id" });
    const { error } = await query;
    if (error) throw new Error(error.message);
    imported += 1;
  }
  await supabaseAdmin.from("google_calendar_connections").update({ updated_at: new Date().toISOString() }).eq("id", conn.id);
  return { imported };
}

export async function watchGoogleCalendar() {
  const conn = await connection();
  const calendarId = encodeURIComponent(conn.calendar_id || "primary");
  const webhookUrl = String(process.env.GOOGLE_CALENDAR_WEBHOOK_URL || "").trim();
  const channelToken = String(process.env.GOOGLE_CALENDAR_CHANNEL_TOKEN || "").trim();
  if (!webhookUrl || !channelToken) throw new Error("Webhook URL/token Google non configurati.");
  const channelId = crypto.randomUUID();
  const expiration = Date.now() + 6 * 86400000;
  const { data } = await googleFetch(`/calendars/${calendarId}/events/watch`, { method: "POST", body: JSON.stringify({ id: channelId, type: "web_hook", address: webhookUrl, token: channelToken, expiration: String(expiration) }) });
  await supabaseAdmin.from("google_calendar_connections").update({ channel_id: data.id, channel_resource_id: data.resourceId, channel_expiration: new Date(Number(data.expiration)).toISOString(), updated_at: new Date().toISOString() }).eq("id", conn.id);
  return data;
}
