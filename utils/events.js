import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";
import eventsJson from "../data/events.json";

const MIN_EVENT_SPOTS = 4;
const MAX_EVENT_SPOTS = 10;

function normalizeString(value = "") {
  return String(value || "").trim();
}

function normalizeSpotsValue(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return MAX_EVENT_SPOTS;
  }

  return Math.max(MIN_EVENT_SPOTS, Math.min(MAX_EVENT_SPOTS, numeric));
}

function normalizeLocale(locale = "it") {
  const lang = locale === "en" ? "en" : "it";
  return locale === "en" ? "en" : "it";
}

function normalizeUrl(value = "") {
  const normalized = normalizeString(value);

  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
}

function normalizeGoogleCalendarMeta(meta) {
  if (!meta || typeof meta !== "object") {
    return null;
  }

  const eventId = normalizeString(meta.eventId);

  if (!eventId) {
    return null;
  }

  return {
    eventId,
    htmlLink: normalizeString(meta.htmlLink),
    status: normalizeString(meta.status) || "synced",
    syncedAt: normalizeString(meta.syncedAt),
    updatedAt: normalizeString(meta.updatedAt),
  };
}

function normalizeStripeCurrency(value) {
  const normalized = normalizeString(value).toLowerCase();
  return normalized || "eur";
}

function normalizeStripeDateConfig(config) {
  if (!config || typeof config !== "object") {
    return null;
  }

  const enabled = Boolean(config.enabled);
  const parsedPriceCents = Number(config.priceCents);
  const priceCents = Number.isFinite(parsedPriceCents)
    ? Math.max(0, Math.round(parsedPriceCents))
    : 0;
  const priceId = normalizeString(config.priceId);

  if (!enabled && !priceCents && !priceId) {
    return null;
  }

  return {
    enabled,
    priceCents,
    currency: normalizeStripeCurrency(config.currency),
    priceId,
  };
}

function normalizeDate(date = {}) {
  const iso = normalizeString(date.iso || date.date);

  const startTime = normalizeString(date.startTime);
  const endTime = normalizeString(date.endTime);

  const fallbackTime = [startTime, endTime].filter(Boolean).join(" - ");

  return {
    iso,
    labelIt: normalizeString(date.labelIt),
    labelEn: normalizeString(date.labelEn),

    // compatibilità vecchio + nuovo formato
    time: normalizeString(date.time) || fallbackTime,

    // mantieni anche i campi separati
    startTime,
    endTime,

    spots: normalizeSpotsValue(date.spots),
    googleCalendar: normalizeGoogleCalendarMeta(date.googleCalendar),
    stripe: normalizeStripeDateConfig(date.stripe),
  };
}

function normalizeEventPayload(payload = {}) {
  return {
    ...payload,
    slug: normalizeString(payload.slug),
    featured: Boolean(payload.featured),
    status: normalizeString(payload.status) || "draft",
    heroImage: normalizeString(payload.heroImage),
    gallery: Array.isArray(payload.gallery)
      ? payload.gallery.map((item) => normalizeString(item)).filter(Boolean)
      : [],
    title: {
      it: normalizeString(payload.title?.it),
      en: normalizeString(payload.title?.en),
    },
    excerpt: {
      it: normalizeString(payload.excerpt?.it),
      en: normalizeString(payload.excerpt?.en),
    },
    category: {
      it: normalizeString(payload.category?.it),
      en: normalizeString(payload.category?.en),
    },
    location: {
      it: normalizeString(payload.location?.it),
      en: normalizeString(payload.location?.en),
    },
    duration: {
      it: normalizeString(payload.duration?.it),
      en: normalizeString(payload.duration?.en),
    },
    price: {
      it: normalizeString(payload.price?.it),
      en: normalizeString(payload.price?.en),
    },
    meetingPoint: {
      it: normalizeString(payload.meetingPoint?.it),
      en: normalizeString(payload.meetingPoint?.en),
      link: {
        it: normalizeUrl(
          payload.meetingPoint?.link?.it || payload.meetingPointLink?.it,
        ),
        en: normalizeUrl(
          payload.meetingPoint?.link?.en || payload.meetingPointLink?.en,
        ),
      },
    },
    languages: {
      it: normalizeString(payload.languages?.it),
      en: normalizeString(payload.languages?.en),
    },
    recurring: {
      it: normalizeString(payload.recurring?.it),
      en: normalizeString(payload.recurring?.en),
    },
    included: {
      it: Array.isArray(payload.included?.it)
        ? payload.included.it
            .map((item) => normalizeString(item))
            .filter(Boolean)
        : [],
      en: Array.isArray(payload.included?.en)
        ? payload.included.en
            .map((item) => normalizeString(item))
            .filter(Boolean)
        : [],
    },
    description: {
      it: Array.isArray(payload.description?.it)
        ? payload.description.it
            .map((item) => normalizeString(item))
            .filter(Boolean)
        : [],
      en: Array.isArray(payload.description?.en)
        ? payload.description.en
            .map((item) => normalizeString(item))
            .filter(Boolean)
        : [],
    },
    dates: Array.isArray(payload.dates)
      ? payload.dates
          .map((date) => normalizeDate(date))
          .filter((date) => date.iso)
      : [],
  };
}

function sortByFirstDate(events) {
  return [...events].sort((left, right) => {
    const leftDate = left?.dates?.[0]?.iso || "";
    const rightDate = right?.dates?.[0]?.iso || "";
    return leftDate.localeCompare(rightDate);
  });
}

function localizeEvent(event, locale = "it") {
  const lang = normalizeLocale(locale);

  return {
    slug: event.slug,
    status: event.status,
    featured: Boolean(event.featured),
    category: event.category?.[lang] || event.category?.it || "",
    title: event.title?.[lang] || event.title?.it || "",
    excerpt: event.excerpt?.[lang] || event.excerpt?.it || "",
    heroImage: event.heroImage || "",
    gallery: Array.isArray(event.gallery) ? event.gallery : [],
    location: event.location?.[lang] || event.location?.it || "",
    duration: event.duration?.[lang] || event.duration?.it || "",
    price: event.price?.[lang] || event.price?.it || "",
    meetingPoint: event.meetingPoint?.[lang] || event.meetingPoint?.it || "",
    meetingPointLink:
      event.meetingPoint?.link?.[lang] ||
      event.meetingPoint?.link?.it ||
      event.meetingPointLink?.[lang] ||
      event.meetingPointLink?.it ||
      "",
    languages: event.languages?.[lang] || event.languages?.it || "",
    recurring: event.recurring?.[lang] || event.recurring?.it || "",
    included: event.included?.[lang] || event.included?.it || [],
    description: event.description?.[lang] || event.description?.it || [],
    dates: (event.dates || []).map((date) => ({
      ...date,
      label: lang === "en" ? date.labelEn : date.labelIt,
    })),
  };
}

function buildSlugFromTitle(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function assertEventShape(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload evento non valido.");
  }

  if (!payload.title?.it || !payload.title?.en) {
    throw new Error("Ogni evento deve avere title.it e title.en.");
  }

  if (!Array.isArray(payload.dates)) {
    throw new Error("Ogni evento deve avere un array dates.");
  }
}

function mergeExistingDateMetadata(existingDates = [], nextDates = []) {
  return nextDates.map((date) => {
    if (date.googleCalendar?.eventId) {
      return date;
    }

    const existingMatch = existingDates.find(
      (current) => current.iso === date.iso && current.googleCalendar?.eventId,
    );

    if (!existingMatch?.googleCalendar) {
      return date;
    }

    return {
      ...date,
      googleCalendar: existingMatch.googleCalendar,
    };
  });
}

export async function readEventsData() {
  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return {
    events: data || [],
  };
}

export async function writeEventsData(data) {
  return data;
}

export function getEventsPageCopy(locale = "it") {
  const lang = locale === "en" ? "en" : "it";

  return eventsJson?.copy?.[lang] ?? eventsJson?.copy?.it ?? {};
}

export async function getAllEvents(locale = "it", options = {}) {
  const { includeDrafts = false } = options;
  const data = await readEventsData();
  const filtered = includeDrafts
    ? data.events || []
    : (data.events || []).filter((event) => event.status === "published");

  return sortByFirstDate(filtered).map((event) => localizeEvent(event, locale));
}

export async function getEventBySlug(slug, locale = "it", options = {}) {
  const { includeDrafts = false } = options;
  const data = await readEventsData();
  const found = (data.events || []).find((event) => event.slug === slug);

  if (!found) {
    return null;
  }

  if (!includeDrafts && found.status !== "published") {
    return null;
  }

  return localizeEvent(found, locale);
}

export async function getEventSlugs(options = {}) {
  const { includeDrafts = false } = options;
  const data = await readEventsData();
  const filtered = includeDrafts
    ? data.events || []
    : (data.events || []).filter((event) => event.status === "published");

  return filtered.map((event) => event.slug);
}

export async function getAdminEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getAdminEventBySlug(slug) {
  const data = await readEventsData();
  return (data.events || []).find((event) => event.slug === slug) || null;
}

export async function createEvent(payload) {
  assertEventShape(payload);

  const normalized = normalizeEventPayload(payload);
  const slug = normalized.slug || buildSlugFromTitle(normalized.title.it);

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("events")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    throw new Error("Esiste gia un evento con questo slug.");
  }

  const event = {
    ...normalized,
    slug,
    heroImage: normalized.heroImage,
  };

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEvent(slug, payload) {
  assertEventShape(payload);

  const normalized = normalizeEventPayload(payload);
  const nextSlug = normalized.slug || slug;

  // 1. prendo evento attuale dal DB
  const { data: currentEvent, error: fetchError } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (fetchError || !currentEvent) {
    return null;
  }

  // 2. controllo duplicati slug
  const { data: duplicate, error: dupError } = await supabaseAdmin
    .from("events")
    .select("slug")
    .eq("slug", nextSlug)
    .neq("slug", slug)
    .maybeSingle();

  if (dupError) {
    throw new Error(dupError.message);
  }

  if (duplicate) {
    throw new Error("Esiste già un evento con questo slug.");
  }

  // 3. merge dates (mantieni logica tua)
  const mergedDates = mergeExistingDateMetadata(
    currentEvent.dates,
    normalized.dates,
  );

  // 4. update su Supabase
  const { data, error } = await supabaseAdmin
    .from("events")
    .update({
      ...normalized,
      slug: nextSlug,
      dates: mergedDates,
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function replaceEventDates(slug, dates) {
  const currentEvent = await getAdminEventBySlug(slug);

  if (!currentEvent) {
    return null;
  }

  const normalizedDates = Array.isArray(dates)
    ? dates.map((date) => normalizeDate(date)).filter((date) => date.iso)
    : [];

  const { data, error } = await supabaseAdmin
    .from("events")
    .update({
      dates: normalizedDates,
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteEvent(slug) {
  const { error } = await supabase.from("events").delete().eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
