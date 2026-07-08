import { supabaseAdmin } from "./supabaseAdmin";

export const SITE_TIMEZONE = "Europe/Rome";
export const HOLD_MINUTES = 15;

function timezoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second)) - date.getTime();
}

export function localDateTimeToIso(dateKey, time, timeZone = SITE_TIMEZONE) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const first = new Date(guess.getTime() - timezoneOffsetMs(guess, timeZone));
  return new Date(guess.getTime() - timezoneOffsetMs(first, timeZone)).toISOString();
}

export function addMinutes(iso, minutes) {
  return new Date(new Date(iso).getTime() + Number(minutes) * 60000).toISOString();
}

export async function getBlockingEntriesInRange(startsAt, endsAt, excludeId = null) {
  let query = supabaseAdmin.from("calendar_entries")
    .select("id,source_type,source_id,title,starts_at,ends_at,status,hold_expires_at,google_event_id")
    .lt("starts_at", endsAt).gt("ends_at", startsAt).neq("status", "cancelled");
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const now = Date.now();
  const entries = (data || []).filter((entry) => entry.status !== "hold" || new Date(entry.hold_expires_at).getTime() > now);

  const { data: events, error: eventsError } = await supabaseAdmin.from("events").select("slug,title,dates").eq("status", "published");
  if (eventsError) throw new Error(eventsError.message);
  const rangeStart = new Date(startsAt).getTime();
  const rangeEnd = new Date(endsAt).getTime();
  for (const event of events || []) {
    for (const date of event.dates || []) {
      const dateKey = String(date.iso || "").slice(0, 10);
      const startTime = date.startTime || String(date.time || "").split("-")[0]?.trim();
      const endTime = date.endTime || String(date.time || "").split("-")[1]?.trim();
      if (!dateKey || !startTime || !endTime) continue;
      const eventStart = new Date(localDateTimeToIso(dateKey, startTime)).getTime();
      const eventEnd = new Date(localDateTimeToIso(dateKey, endTime)).getTime();
      if (eventStart < rangeEnd && eventEnd > rangeStart) {
        entries.push({ id: `event:${event.slug}:${date.iso}`, source_type: "event", title: event.title?.it || event.slug, starts_at: new Date(eventStart).toISOString(), ends_at: new Date(eventEnd).toISOString(), status: "confirmed" });
      }
    }
  }
  return entries;
}

export async function getConflictingEntries(startsAt, endsAt, excludeId = null) {
  return getBlockingEntriesInRange(startsAt, endsAt, excludeId);
}

export async function createCheckoutHold({ tour, startsAt, endsAt, metadata }) {
  const conflicts = await getConflictingEntries(startsAt, endsAt);
  if (conflicts.length) throw new Error("La fascia selezionata non e piu disponibile.");
  const { data, error } = await supabaseAdmin.from("calendar_entries").insert({
    source_type: "tour_booking", source_id: metadata.checkoutReference,
    tour_slug: tour.slug, title: `Tour: ${tour.title}`, starts_at: startsAt,
    ends_at: endsAt, status: "hold",
    hold_expires_at: new Date(Date.now() + HOLD_MINUTES * 60000).toISOString(), metadata,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}
