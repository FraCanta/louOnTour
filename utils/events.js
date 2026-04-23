import { promises as fs } from "fs";
import path from "path";

const EVENTS_FILE = path.join(process.cwd(), "data", "events.json");

function normalizeString(value = "") {
  return String(value || "").trim();
}

function normalizeLocale(locale = "it") {
  return locale === "en" ? "en" : "it";
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

    spots: Number(date.spots) || 0,
    googleCalendar: normalizeGoogleCalendarMeta(date.googleCalendar),
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
  const raw = await fs.readFile(EVENTS_FILE, "utf8");
  return JSON.parse(raw);
}

export async function writeEventsData(data) {
  await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getEventsPageCopy(locale = "it") {
  const data = await readEventsData();
  const lang = normalizeLocale(locale);
  return data.copy?.[lang] || data.copy?.it || {};
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
  const data = await readEventsData();
  return sortByFirstDate(data.events || []);
}

export async function getAdminEventBySlug(slug) {
  const data = await readEventsData();
  return (data.events || []).find((event) => event.slug === slug) || null;
}

export async function createEvent(payload) {
  assertEventShape(payload);

  const data = await readEventsData();
  const normalized = normalizeEventPayload(payload);
  const slug = normalized.slug || buildSlugFromTitle(normalized.title.it);

  if ((data.events || []).some((event) => event.slug === slug)) {
    throw new Error("Esiste gia un evento con questo slug.");
  }

  const event = {
    ...normalized,
    slug,
  };

  data.events.push(event);
  await writeEventsData(data);
  return event;
}

export async function updateEvent(slug, payload) {
  assertEventShape(payload);

  const data = await readEventsData();
  const index = (data.events || []).findIndex((event) => event.slug === slug);

  if (index === -1) {
    return null;
  }

  const normalized = normalizeEventPayload(payload);
  const nextSlug = normalized.slug || slug;
  const duplicated = data.events.some(
    (event, currentIndex) => event.slug === nextSlug && currentIndex !== index,
  );

  if (duplicated) {
    throw new Error("Esiste gia un evento con questo slug.");
  }

  const updated = {
    ...normalized,
    slug: nextSlug,
    dates: mergeExistingDateMetadata(
      data.events[index]?.dates,
      normalized.dates,
    ),
  };

  data.events[index] = updated;
  await writeEventsData(data);
  return updated;
}

export async function replaceEventDates(slug, dates) {
  const data = await readEventsData();
  const index = (data.events || []).findIndex((event) => event.slug === slug);

  if (index === -1) {
    return null;
  }

  data.events[index].dates = Array.isArray(dates)
    ? dates.map((date) => normalizeDate(date)).filter((date) => date.iso)
    : [];

  await writeEventsData(data);
  return data.events[index];
}

export async function deleteEvent(slug) {
  const data = await readEventsData();
  const nextEvents = (data.events || []).filter((event) => event.slug !== slug);

  if (nextEvents.length === (data.events || []).length) {
    return false;
  }

  data.events = nextEvents;
  await writeEventsData(data);
  return true;
}
