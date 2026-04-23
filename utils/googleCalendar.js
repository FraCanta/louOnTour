import { getAdminEventBySlug, getAdminEvents, replaceEventDates } from "./events";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const DEFAULT_TIMEZONE = "Europe/Rome";

function readGoogleConfig() {
  const config = {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
    calendarId: process.env.GOOGLE_CALENDAR_ID || "",
    timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE || DEFAULT_TIMEZONE,
  };

  const missing = [
    ["GOOGLE_CLIENT_ID", config.clientId],
    ["GOOGLE_CLIENT_SECRET", config.clientSecret],
    ["GOOGLE_REFRESH_TOKEN", config.refreshToken],
    ["GOOGLE_CALENDAR_ID", config.calendarId],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  return {
    ...config,
    missing,
    configured: missing.length === 0,
  };
}

function toIsoDateTime(dateValue, timeValue = "00:00") {
  return `${dateValue}T${timeValue}:00`;
}

function parseTimeRange(date) {
  const match = String(date?.time || "")
    .trim()
    .match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);

  const isoMatch = String(date?.iso || "")
    .trim()
    .match(/T(\d{2}:\d{2})/);

  const startTime = match?.[1] || isoMatch?.[1] || "10:00";
  const endTime = match?.[2] || startTime;
  const dateValue = String(date?.iso || "").split("T")[0];

  if (!dateValue) {
    throw new Error("Data evento Google non valida.");
  }

  return {
    startDateTime: toIsoDateTime(dateValue, startTime),
    endDateTime: toIsoDateTime(dateValue, endTime),
  };
}

function buildDescription(event, date) {
  const sections = [
    event.excerpt?.it,
    event.description?.it?.length
      ? event.description.it.join("\n\n")
      : "",
    `Prezzo: ${event.price?.it || "-"}`,
    `Punto di ritrovo: ${event.meetingPoint?.it || event.location?.it || "-"}`,
    `Lingue: ${event.languages?.it || "-"}`,
    `Posti disponibili: ${date.spots ?? "-"}`,
    `Slug Lou On Tour: ${event.slug}`,
  ];

  return sections.filter(Boolean).join("\n\n");
}

function buildGoogleEventResource(event, date, config) {
  const { startDateTime, endDateTime } = parseTimeRange(date);

  return {
    summary: event.title?.it || event.slug,
    description: buildDescription(event, date),
    location: event.meetingPoint?.it || event.location?.it || "",
    start: {
      dateTime: startDateTime,
      timeZone: config.timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: config.timeZone,
    },
    extendedProperties: {
      private: {
        louSlug: event.slug,
        louDateIso: date.iso,
      },
    },
  };
}

async function getGoogleAccessToken(config) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "OAuth Google non riuscito.");
  }

  return data.access_token;
}

async function googleCalendarRequest(config, accessToken, path, options = {}) {
  const response = await fetch(`${GOOGLE_CALENDAR_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Richiesta Google Calendar non riuscita.");
  }

  return data;
}

function buildSyncMetaFromGoogleResponse(response) {
  return {
    eventId: response.id,
    htmlLink: response.htmlLink || "",
    status: response.status || "confirmed",
    syncedAt: new Date().toISOString(),
    updatedAt: response.updated || "",
  };
}

export function getGoogleCalendarStatus(events = []) {
  const config = readGoogleConfig();
  const publishedEvents = events.filter((event) => event.status === "published");
  const publishedDates = publishedEvents.reduce(
    (sum, event) => sum + (event.dates?.length || 0),
    0,
  );
  const syncedDates = events.reduce(
    (sum, event) =>
      sum +
      (event.dates || []).filter((date) => date.googleCalendar?.eventId).length,
    0,
  );

  return {
    configured: config.configured,
    missing: config.missing,
    calendarId: config.calendarId || "",
    timeZone: config.timeZone,
    publishedEvents: publishedEvents.length,
    publishedDates,
    syncedDates,
  };
}

export async function getGoogleCalendarStatusFromData() {
  const events = await getAdminEvents();
  return getGoogleCalendarStatus(events);
}

export async function syncEventToGoogleCalendar(slug) {
  const config = readGoogleConfig();

  if (!config.configured) {
    throw new Error(`Configurazione Google mancante: ${config.missing.join(", ")}`);
  }

  const event = await getAdminEventBySlug(slug);

  if (!event) {
    throw new Error("Evento non trovato.");
  }

  if (event.status !== "published") {
    throw new Error("Puoi sincronizzare solo eventi pubblicati.");
  }

  const accessToken = await getGoogleAccessToken(config);
  const nextDates = [];

  for (const date of event.dates || []) {
    const payload = buildGoogleEventResource(event, date, config);
    let response;

    if (date.googleCalendar?.eventId) {
      response = await googleCalendarRequest(
        config,
        accessToken,
        `/calendars/${encodeURIComponent(config.calendarId)}/events/${encodeURIComponent(
          date.googleCalendar.eventId,
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
    } else {
      response = await googleCalendarRequest(
        config,
        accessToken,
        `/calendars/${encodeURIComponent(config.calendarId)}/events`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    }

    nextDates.push({
      ...date,
      googleCalendar: buildSyncMetaFromGoogleResponse(response),
    });
  }

  const updatedEvent = await replaceEventDates(event.slug, nextDates);

  return {
    slug: event.slug,
    syncedDates: nextDates.length,
    event: updatedEvent,
  };
}

export async function syncPublishedEventsToGoogleCalendar() {
  const events = await getAdminEvents();
  const published = events.filter((event) => event.status === "published");
  const results = [];

  for (const event of published) {
    const result = await syncEventToGoogleCalendar(event.slug);
    results.push(result);
  }

  return {
    syncedEvents: results.length,
    syncedDates: results.reduce((sum, result) => sum + result.syncedDates, 0),
    results,
  };
}

export async function unsyncEventFromGoogleCalendar(slug) {
  const config = readGoogleConfig();
  const event = await getAdminEventBySlug(slug);

  if (!event) {
    throw new Error("Evento non trovato.");
  }

  if (!config.configured) {
    const clearedDates = (event.dates || []).map((date) => ({
      ...date,
      googleCalendar: null,
    }));
    const updatedEvent = await replaceEventDates(event.slug, clearedDates);

    return {
      slug: event.slug,
      removedDates: 0,
      event: updatedEvent,
      skippedRemoteDelete: true,
    };
  }

  const accessToken = await getGoogleAccessToken(config);
  let removedDates = 0;

  for (const date of event.dates || []) {
    if (!date.googleCalendar?.eventId) {
      continue;
    }

    await googleCalendarRequest(
      config,
      accessToken,
      `/calendars/${encodeURIComponent(config.calendarId)}/events/${encodeURIComponent(
        date.googleCalendar.eventId,
      )}`,
      {
        method: "DELETE",
      },
    );
    removedDates += 1;
  }

  const clearedDates = (event.dates || []).map((date) => ({
    ...date,
    googleCalendar: null,
  }));
  const updatedEvent = await replaceEventDates(event.slug, clearedDates);

  return {
    slug: event.slug,
    removedDates,
    event: updatedEvent,
    skippedRemoteDelete: false,
  };
}
