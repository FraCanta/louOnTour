import Head from "next/head";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { uploadEventImage } from "../../utils/uploadEventImage";
import { supabase } from "../../utils/supabase";
import {
  getBookingAttendeeCount,
  isCountableBooking,
  isTestBooking,
} from "../../utils/eventBookings";

const SITE_TIMEZONE = "Europe/Rome";
const MIN_EVENT_SPOTS = 4;
const MAX_EVENT_SPOTS = 10;
const SESSION_EXPIRED_MESSAGE =
  "Sessione scaduta. Effettua di nuovo l'accesso.";
const NAV_ITEMS = [
  { id: "overview", label: "Panoramica", icon: "hugeicons:square-lock-02" },
  { id: "events", label: "Eventi", icon: "hugeicons:calendar-03" },
  { id: "editor", label: "Editor", icon: "hugeicons:note-edit" },
  { id: "payments", label: "Pagamenti", icon: "hugeicons:credit-card" },
];
const EMPTY_MANUAL_BOOKING_FORM = {
  customerEmail: "",
  attendeeCount: "1",
  attendeeNames: "",
  amountEuro: "",
  paymentStatus: "pending",
  note: "",
};
const MANUAL_PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "In versamento" },
  { value: "paid", label: "Pagato" },
];

function createDateEntry(partial = {}) {
  const initialStripePriceEuro = partial.stripePriceEuro
    ? String(partial.stripePriceEuro).trim()
    : formatStripePriceEuros(partial.stripePriceCents);

  return {
    id:
      partial.id ||
      `date-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: partial.date || "",
    startTime: partial.startTime || "",
    endTime: partial.endTime || "",
    labelIt: partial.labelIt || "",
    labelEn: partial.labelEn || "",
    spots: String(partial.spots ?? "10"),
    stripeEnabled: Boolean(partial.stripeEnabled),
    stripePriceEuro: initialStripePriceEuro,
    stripeCurrency: String(partial.stripeCurrency || "eur")
      .trim()
      .toLowerCase(),
  };
}

function buildEmptyForm() {
  return {
    slug: "",
    status: "draft",
    featured: false,
    heroImage: "",
    galleryText: "",
    titleIt: "",
    titleEn: "",
    excerptIt: "",
    excerptEn: "",
    categoryIt: "",
    categoryEn: "",
    locationIt: "",
    locationEn: "",
    durationIt: "",
    durationEn: "",
    priceIt: "",
    priceEn: "",
    meetingPointIt: "",
    meetingPointEn: "",
    meetingPointLinkIt: "",
    meetingPointLinkEn: "",
    languagesIt: "",
    languagesEn: "",
    recurringIt: "",
    recurringEn: "",
    includedIt: "",
    includedEn: "",
    descriptionIt: "",
    descriptionEn: "",
    dates: [createDateEntry()],
  };
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value) {
  return String(value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSpotsValue(value) {
  const numeric = Number(String(value || "").trim());

  if (!Number.isFinite(numeric)) {
    return MAX_EVENT_SPOTS;
  }

  return Math.max(MIN_EVENT_SPOTS, Math.min(MAX_EVENT_SPOTS, numeric));
}

function normalizeCurrencyValue(value = "eur") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return normalized || "eur";
}

function parseStripePriceCents(value) {
  const parsed = Number(String(value || "").replace(",", "."));

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.round(parsed * 100));
}

function formatStripePriceEuros(priceCents) {
  const parsed = Number(priceCents);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }

  return (parsed / 100).toFixed(2);
}

function buildSlugFromTitle(title = "") {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDateLabel(dateValue, locale = "it") {
  if (!dateValue) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat(
    locale === "en" ? "en-US" : "it-IT",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: SITE_TIMEZONE,
    },
  );

  return formatter.format(new Date(`${dateValue}T12:00:00`));
}

function parseDateTimeParts(date = {}) {
  const iso = String(date.iso || "");
  const [datePart, rawTime = ""] = iso.split("T");
  const isoTime = rawTime.slice(0, 5);
  const timeMatch = String(date.time || "")
    .trim()
    .match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);

  return {
    date: datePart || "",
    startTime: timeMatch?.[1] || isoTime || "",
    endTime: timeMatch?.[2] || "",
  };
}

function eventToForm(event) {
  if (!event) {
    return buildEmptyForm();
  }

  return {
    slug: event.slug || "",
    status: event.status || "draft",
    featured: Boolean(event.featured),
    heroImage: event.heroImage || "",
    galleryText: (event.gallery || []).join("\n"),
    titleIt: event.title?.it || "",
    titleEn: event.title?.en || "",
    excerptIt: event.excerpt?.it || "",
    excerptEn: event.excerpt?.en || "",
    categoryIt: event.category?.it || "",
    categoryEn: event.category?.en || "",
    locationIt: event.location?.it || "",
    locationEn: event.location?.en || "",
    durationIt: event.duration?.it || "",
    durationEn: event.duration?.en || "",
    priceIt: event.price?.it || "",
    priceEn: event.price?.en || "",
    meetingPointIt: event.meetingPoint?.it || "",
    meetingPointEn: event.meetingPoint?.en || "",
    meetingPointLinkIt:
      event.meetingPoint?.link?.it || event.meetingPointLink?.it || "",
    meetingPointLinkEn:
      event.meetingPoint?.link?.en || event.meetingPointLink?.en || "",
    languagesIt: event.languages?.it || "",
    languagesEn: event.languages?.en || "",
    recurringIt: event.recurring?.it || "",
    recurringEn: event.recurring?.en || "",
    includedIt: (event.included?.it || []).join("\n"),
    includedEn: (event.included?.en || []).join("\n"),
    descriptionIt: (event.description?.it || []).join("\n\n"),
    descriptionEn: (event.description?.en || []).join("\n\n"),
    dates:
      event.dates?.length > 0
        ? event.dates.map((date) => {
            const parsed = parseDateTimeParts(date);

            return createDateEntry({
              date: parsed.date,
              startTime: parsed.startTime,
              endTime: parsed.endTime,
              labelIt: date.labelIt || formatDateLabel(parsed.date, "it"),
              labelEn: date.labelEn || formatDateLabel(parsed.date, "en"),
              spots: String(date.spots ?? "10"),
              stripeEnabled: Boolean(date.stripe?.enabled),
              stripePriceEuro: formatStripePriceEuros(date.stripe?.priceCents),
              stripeCurrency: normalizeCurrencyValue(date.stripe?.currency),
            });
          })
        : [createDateEntry()],
  };
}

function dateEntryToPayload(date) {
  const dateValue = String(date.date || "").trim();

  if (!dateValue) {
    return null;
  }

  const startTime = String(date.startTime || "").trim() || "10:00";
  const endTime = String(date.endTime || "").trim() || startTime;

  return {
    iso: `${dateValue}T${startTime}:00`,
    labelIt:
      String(date.labelIt || "").trim() || formatDateLabel(dateValue, "it"),
    labelEn:
      String(date.labelEn || "").trim() || formatDateLabel(dateValue, "en"),
    time: `${startTime} - ${endTime}`,
    spots: normalizeSpotsValue(date.spots),
    stripe: {
      enabled: Boolean(date.stripeEnabled),
      priceCents: parseStripePriceCents(date.stripePriceEuro),
      currency: normalizeCurrencyValue(date.stripeCurrency),
    },
  };
}

function formToPayload(form) {
  return {
    slug: form.slug.trim(),
    status: form.status,
    featured: form.featured,
    heroImage: form.heroImage.trim(),
    gallery: splitLines(form.galleryText),
    title: {
      it: form.titleIt.trim(),
      en: form.titleEn.trim(),
    },
    excerpt: {
      it: form.excerptIt.trim(),
      en: form.excerptEn.trim(),
    },
    category: {
      it: form.categoryIt.trim(),
      en: form.categoryEn.trim(),
    },
    location: {
      it: form.locationIt.trim(),
      en: form.locationEn.trim(),
    },
    duration: {
      it: form.durationIt.trim(),
      en: form.durationEn.trim(),
    },
    price: {
      it: form.priceIt.trim(),
      en: form.priceEn.trim(),
    },
    meetingPoint: {
      it: form.meetingPointIt.trim(),
      en: form.meetingPointEn.trim(),
      link: {
        it: form.meetingPointLinkIt.trim(),
        en: form.meetingPointLinkEn.trim(),
      },
    },
    languages: {
      it: form.languagesIt.trim(),
      en: form.languagesEn.trim(),
    },
    recurring: {
      it: form.recurringIt.trim(),
      en: form.recurringEn.trim(),
    },
    included: {
      it: splitLines(form.includedIt),
      en: splitLines(form.includedEn),
    },
    description: {
      it: splitParagraphs(form.descriptionIt),
      en: splitParagraphs(form.descriptionEn),
    },
    dates: form.dates.map((date) => dateEntryToPayload(date)).filter(Boolean),
  };
}

function validateForm(form) {
  if (!form.titleIt.trim() || !form.titleEn.trim()) {
    return "Inserisci almeno titolo IT e titolo EN.";
  }

  const validDates = form.dates.filter((date) => date.date);

  if (!validDates.length) {
    return "Aggiungi almeno una data all'evento.";
  }

  const invalidDate = validDates.find(
    (date) =>
      !date.startTime ||
      !date.endTime ||
      !String(date.spots || "").trim() ||
      normalizeSpotsValue(date.spots) < MIN_EVENT_SPOTS ||
      normalizeSpotsValue(date.spots) > MAX_EVENT_SPOTS ||
      !date.labelIt.trim() ||
      !date.labelEn.trim() ||
      (date.stripeEnabled && parseStripePriceCents(date.stripePriceEuro) <= 0),
  );

  if (invalidDate) {
    return "Ogni data deve avere giorno, orario, posti (min 4, max 10), label IT/EN e prezzo Stripe se il pagamento e attivo.";
  }

  return "";
}

function StatsCard({ label, value, note, icon }) {
  return (
    <article className="rounded-md border border-[#c9573c]/10 bg-white/80 p-5 shadow-[0_16px_40px_rgba(35,47,55,0.05)] backdrop-blur-sm">
      <div className="flex items-start justify-between mb-5">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#CE9486]/20 text-[#c9573c]">
          <Icon icon={icon} width="21" height="21" />
        </span>
        <span className="rounded-full bg-[#fef3ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#77674E]">
          Live
        </span>
      </div>
      <p className="mb-2 text-sm font-semibold text-[#6d7b80]">{label}</p>
      <p className="mb-1 text-4xl font-bold text-[#2c395b]">{value}</p>
      <p className="text-sm text-[#6d7b80]">{note}</p>
    </article>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-semibold text-[#2c395b]">{label}</span>
      {children}
    </label>
  );
}

function baseInputClass(multiline = false) {
  return `rounded-xl border border-[#c9573c]/15 bg-[#fffaf7] px-4 py-3 text-sm outline-none transition focus:border-[#c9573c] ${
    multiline ? "min-h-[120px]" : ""
  }`;
}

function getAdminDisplayName(user) {
  if (!user) {
    return "";
  }

  const metadata = user.user_metadata || {};
  const explicitName =
    metadata.full_name || metadata.name || metadata.display_name || "";

  if (String(explicitName).trim()) {
    return String(explicitName).trim();
  }

  const email = String(user.email || "").trim();

  if (!email) {
    return "";
  }

  return email.split("@")[0] || email;
}

function getFileNameFromUrl(url = "") {
  const value = String(url || "").trim();

  if (!value) {
    return "";
  }

  const withoutQuery = value.split("?")[0];
  const segments = withoutQuery.split("/");
  const fileName = segments[segments.length - 1] || "";

  try {
    return decodeURIComponent(fileName);
  } catch (_error) {
    return fileName;
  }
}

function isSessionExpiredResponse(response, data) {
  if (response?.status === 401) {
    return true;
  }

  const errorText = String(data?.error || "").toLowerCase();
  return (
    errorText.includes("sessione non valida") ||
    errorText.includes("scaduta") ||
    errorText.includes("unauthorized")
  );
}

function formatAdminDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoneyFromCents(cents, currency = "eur") {
  const amount = Number(cents || 0) / 100;
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: String(currency || "eur").toUpperCase(),
  }).format(amount);
}

function getAttendeeNames(payment) {
  const raw = String(
    payment?.raw_payload?.metadata?.attendeeNames || "",
  ).trim();

  if (!raw) {
    return [];
  }

  return raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPaymentEventDateLabel(payment) {
  const metadata = payment?.raw_payload?.metadata || {};
  const label = String(metadata.eventDateLabel || "").trim();
  const iso = String(
    payment?.event_date_iso || metadata.eventDateIso || "",
  ).trim();

  if (label && label !== iso) {
    return label;
  }

  return iso || "-";
}

function getIsoDateKey(value = "") {
  return String(value || "").split("T")[0] || "";
}

function getAdminMonthLabel(date) {
  return new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
    timeZone: SITE_TIMEZONE,
  }).format(date);
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const days = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day, 12, 0, 0);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    days.push({
      key,
      day,
    });
  }

  return days;
}

function getEventStripeDateCount(event) {
  return (event?.dates || []).filter(
    (date) =>
      Boolean(date?.stripe?.enabled) && Number(date?.stripe?.priceCents) > 0,
  ).length;
}

function getEventNextDateLabel(event) {
  const firstDate = event?.dates?.[0];
  return (
    [firstDate?.labelIt, firstDate?.time].filter(Boolean).join(" - ") ||
    "Nessuna data"
  );
}

function OverviewPanel({
  events,
  payments,
  paymentStats,
  loading,
  onNewEvent,
  onOpenEvents,
  onOpenEditor,
  onOpenPayments,
  onSelectEvent,
  onCreateManualBooking,
}) {
  const publishedEvents = events.filter(
    (event) => event.status === "published",
  );
  const draftEvents = events.filter((event) => event.status === "draft");
  const countablePayments = payments.filter(isCountableBooking);
  const testPaymentsCount = payments.filter(isTestBooking).length;
  const onlineCheckoutDates = events.reduce(
    (sum, event) => sum + getEventStripeDateCount(event),
    0,
  );
  const latestEvents = events.slice(0, 4);
  const latestPayments = countablePayments.slice(0, 4);
  const firstEventMonth = events
    .flatMap((event) => event.dates || [])
    .map((date) => getIsoDateKey(date.iso))
    .filter(Boolean)
    .sort()[0];
  const initialMonthDate = firstEventMonth
    ? new Date(`${firstEventMonth.slice(0, 7)}-01T12:00:00`)
    : new Date();
  const [calendarMonth, setCalendarMonth] = useState(initialMonthDate);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [manualBookingKey, setManualBookingKey] = useState("");
  const [manualBookingForm, setManualBookingForm] = useState(
    EMPTY_MANUAL_BOOKING_FORM,
  );
  const [manualBookingSaving, setManualBookingSaving] = useState(false);
  const calendarDays = getCalendarDays(calendarMonth);
  const calendarMonthKey = [
    calendarMonth.getFullYear(),
    String(calendarMonth.getMonth() + 1).padStart(2, "0"),
  ].join("-");
  const bookingsByDate = payments.reduce((accumulator, payment) => {
    if (!isCountableBooking(payment)) {
      return accumulator;
    }

    const key = getIsoDateKey(payment.event_date_iso);

    if (!key) {
      return accumulator;
    }

    accumulator[key] =
      (accumulator[key] || 0) + getBookingAttendeeCount(payment);
    return accumulator;
  }, {});
  const eventsByDate = events.reduce((accumulator, event) => {
    (event.dates || []).forEach((date) => {
      const key = getIsoDateKey(date.iso);

      if (!key) {
        return;
      }

      accumulator[key] = accumulator[key] || [];
      accumulator[key].push({ event, date });
    });

    return accumulator;
  }, {});
  const monthEventDates = Object.keys(eventsByDate).filter((key) =>
    key.startsWith(calendarMonthKey),
  ).length;
  const monthEventEntries = Object.entries(eventsByDate)
    .filter(([key]) => key.startsWith(calendarMonthKey))
    .flatMap(([key, entries]) =>
      entries.map((entry) => ({
        key,
        event: entry.event,
        date: entry.date,
      })),
    )
    .sort((left, right) => {
      const dateComparison = String(left.date?.iso || "").localeCompare(
        String(right.date?.iso || ""),
      );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return String(left.event?.title?.it || left.event?.slug || "").localeCompare(
        String(right.event?.title?.it || right.event?.slug || ""),
      );
    });
  const monthBookings = Object.entries(bookingsByDate)
    .filter(([key]) => key.startsWith(calendarMonthKey))
    .reduce((sum, [, count]) => sum + count, 0);
  const selectedDayEvents = selectedCalendarDay
    ? eventsByDate[selectedCalendarDay.key] || []
    : [];
  const selectedDayPayments = selectedCalendarDay
    ? payments.filter(
        (payment) =>
          isCountableBooking(payment) &&
          getIsoDateKey(payment.event_date_iso) === selectedCalendarDay.key,
      )
    : [];
  const selectedDayBookedCount = selectedDayPayments.reduce(
    (sum, payment) => sum + getBookingAttendeeCount(payment),
    0,
  );
  const selectedDayLabel =
    selectedDayEvents[0]?.date?.labelIt ||
    selectedCalendarDay?.key ||
    "Giorno selezionato";

  function changeCalendarMonth(offset) {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1,
          12,
          0,
          0,
        ),
    );
  }

  function openManualBookingForm(event, date) {
    setManualBookingKey(`${event.slug}-${date.iso}`);
    setManualBookingForm({
      ...EMPTY_MANUAL_BOOKING_FORM,
      note: "Bonifico",
    });
  }

  function updateManualBookingField(field, value) {
    setManualBookingForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitManualBooking(event, date) {
    setManualBookingSaving(true);

    try {
      await onCreateManualBooking({
        eventSlug: event.slug,
        eventDateIso: date.iso,
        ...manualBookingForm,
      });
      setManualBookingKey("");
      setManualBookingForm(EMPTY_MANUAL_BOOKING_FORM);
    } catch (_error) {
      // The parent already surfaces the error in the admin notice area.
    } finally {
      setManualBookingSaving(false);
    }
  }

  return (
    <>
    <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
      <div className="flex flex-col gap-3 mb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
            Panoramica
          </p>
          <h3 className="text-3xl font-bold text-[#2c395b]">Stato operativo</h3>
        </div>
        {loading ? (
          <span className="text-sm font-semibold text-[#77674E]">
            Caricamento...
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr] 4xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              {
                label: "Pubblicati",
                value: publishedEvents.length,
                note: "Eventi visibili",
                icon: "hugeicons:checkmark-circle-02",
              },
              {
                label: "Bozze",
                value: draftEvents.length,
                note: "Da completare",
                icon: "hugeicons:note-edit",
              },
              {
                label: "Date checkout",
                value: onlineCheckoutDates,
                note: "Con Stripe attivo",
                icon: "hugeicons:credit-card",
              },
              {
                label: "Incasso",
                value: formatMoneyFromCents(paymentStats.totalCents, "eur"),
                note: `${paymentStats.successfulCount} pagamenti`,
                icon: "hugeicons:wallet-02",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-[#c9573c]/10 bg-[#fff8f4] p-4"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#CE9486]/20 text-[#c9573c]">
                  <Icon icon={item.icon} width="19" height="19" />
                </div>
                <p className="text-sm font-semibold text-[#6d7b80]">
                  {item.label}
                </p>
                <p className="mt-1 text-3xl font-bold text-[#2c395b]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-[#6d7b80]">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            <section className="rounded-md border border-[#c9573c]/10 bg-white p-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="text-lg font-bold text-[#2c395b]">
                  Ultimi eventi
                </h4>
                <button
                  type="button"
                  onClick={onOpenEvents}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9573c]"
                >
                  Apri archivio
                </button>
              </div>
              <div className="space-y-3">
                {latestEvents.length ? (
                  latestEvents.map((event) => (
                    <button
                      key={event.slug}
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className="block w-full rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-3 text-left transition hover:bg-[#fff8f4]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#2c395b]">
                            {event.title?.it || event.slug}
                          </p>
                          <p className="mt-1 text-xs text-[#6d7b80]">
                            {getEventNextDateLabel(event)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                            event.status === "published"
                              ? "bg-[#dfe9df] text-[#4b6b4e]"
                              : "bg-[#f5e4d8] text-[#9c613d]"
                          }`}
                        >
                          {event.status === "published" ? "Live" : "Bozza"}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-4 text-sm text-[#6d7b80]">
                    Nessun evento ancora.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-md border border-[#c9573c]/10 bg-white p-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="text-lg font-bold text-[#2c395b]">
                  Ultimi pagamenti
                </h4>
                <button
                  type="button"
                  onClick={onOpenPayments}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9573c]"
                >
                  Apri pagamenti
                </button>
              </div>
              <div className="space-y-3">
                {latestPayments.length ? (
                  latestPayments.map((payment) => (
                    <div
                      key={payment.stripe_session_id}
                      className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#2c395b]">
                            {payment.event_slug || "-"}
                          </p>
                          <p className="mt-1 text-xs text-[#6d7b80]">
                            {getPaymentEventDateLabel(payment)}
                          </p>
                        </div>
                        <span className="font-semibold text-[#2c395b]">
                          {formatMoneyFromCents(
                            payment.amount_total,
                            payment.currency,
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-4 text-sm text-[#6d7b80]">
                    Nessun pagamento registrato.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md bg-[#2c395b] p-5 text-[#fef3ea]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#fef3ea]/70">
              Azioni rapide
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={onNewEvent}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fef3ea] px-4 py-3 text-sm font-semibold text-[#2c395b]"
              >
                <Icon icon="hugeicons:add-circle" width="18" height="18" />
                Nuovo evento
              </button>
              <button
                type="button"
                onClick={onOpenEditor}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#fef3ea]/20 px-4 py-3 text-sm font-semibold text-white"
              >
                <Icon icon="hugeicons:note-edit" width="18" height="18" />
                Apri editor
              </button>
            </div>
          </div>

          <div className="rounded-md border border-[#c9573c]/10 bg-[#fff8f4] p-4 shadow-[0_16px_40px_rgba(35,47,55,0.05)]">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9573c]/70">
                  Calendario sito
                </p>
                <p className="text-2xl font-bold capitalize text-[#2c395b]">
                  {getAdminMonthLabel(calendarMonth)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(-1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9573c]/15 bg-white text-[#c9573c]"
                  aria-label="Mese precedente"
                >
                  <Icon icon="hugeicons:arrow-left-02" width="18" height="18" />
                </button>
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9573c]/15 bg-white text-[#c9573c]"
                  aria-label="Mese successivo"
                >
                  <Icon
                    icon="hugeicons:arrow-right-02"
                    width="18"
                    height="18"
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="px-3 py-2 bg-white rounded-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9573c]/70">
                  Eventi mese
                </p>
                <p className="mt-1 text-2xl font-bold text-[#2c395b]">
                  {monthEventEntries.length}
                </p>
                <p className="mt-1 text-[10px] text-[#6d7b80]">
                  {monthEventDates} giorni
                </p>
              </div>
              <div className="px-3 py-2 bg-white rounded-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9573c]/70">
                  Prenotati
                </p>
                <p className="mt-1 text-2xl font-bold text-[#2c395b]">
                  {monthBookings}
                </p>
                {testPaymentsCount ? (
                  <p className="mt-1 text-[10px] text-[#6d7b80]">
                    {testPaymentsCount} test esclusi
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77674E]">
              {["L", "M", "M", "G", "V", "S", "D"].map((dayLabel, index) => (
                <span key={`${dayLabel}-${index}`}>{dayLabel}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div key={`empty-${index}`} className="min-h-[72px]" />
                  );
                }

                const dayEvents = eventsByDate[day.key] || [];
                const bookedCount = bookingsByDate[day.key] || 0;
                const hasEvent = dayEvents.length > 0;
                const hasDayActivity = hasEvent || bookedCount > 0;
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() =>
                      hasDayActivity
                        ? setSelectedCalendarDay({
                            key: day.key,
                            day: day.day,
                          })
                        : null
                    }
                    disabled={!hasDayActivity}
                    className={`min-h-[72px] rounded-xl border p-2 text-left transition ${
                      hasDayActivity
                        ? "border-[#c9573c]/25 bg-white shadow-[0_10px_24px_rgba(35,47,55,0.05)]"
                        : "border-transparent bg-white/45 text-[#6d7b80]"
                    } ${
                      hasDayActivity
                        ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#c9573c]/45 hover:bg-[#fffaf7]"
                        : "cursor-default"
                    }`}
                  >
                    <span className="block text-sm font-bold text-[#2c395b]">
                      {day.day}
                    </span>
                    {hasEvent ? (
                      <span className="mt-2 block h-1.5 w-8 rounded-full bg-[#c9573c]" />
                    ) : null}
                    {dayEvents.length > 1 ? (
                      <span className="mt-2 inline-flex rounded-full bg-[#c9573c]/10 px-2 py-1 text-[10px] font-bold text-[#c9573c]">
                        {dayEvents.length} eventi
                      </span>
                    ) : null}
                    {bookedCount ? (
                      <span className="mt-2 inline-flex rounded-full bg-[#dfe9df] px-2 py-1 text-[10px] font-bold text-[#4b6b4e]">
                        {bookedCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              {monthEventEntries.length ? (
                monthEventEntries.map(({ key, event, date }) => (
                  <button
                    key={`${key}-${event.slug}-${date.iso}`}
                    type="button"
                    onClick={() => onSelectEvent(event)}
                    className="block w-full rounded-xl bg-white px-3 py-2 text-left transition hover:bg-[#fef3ea]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9573c]/70">
                      {date.labelIt || key}
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#2c395b]">
                      {event.title?.it || event.slug}
                    </p>
                  </button>
                ))
              ) : (
                <p className="rounded-xl bg-white px-3 py-2 text-sm text-[#6d7b80]">
                  Nessun evento in questo mese.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
    {selectedCalendarDay ? (
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#17212a]/45 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-day-modal-title"
      >
        <div className="max-h-[min(86vh,760px)] w-full max-w-3xl overflow-y-auto rounded-md bg-[#fffaf7] p-5 shadow-[0_30px_80px_rgba(23,33,42,0.24)] lg:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#c9573c]/70">
                Riepilogo giorno
              </p>
              <h3
                id="calendar-day-modal-title"
                className="text-2xl font-bold text-[#2c395b]"
              >
                {selectedDayLabel}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1.5 text-[#2c395b]">
                  {selectedDayEvents.length}{" "}
                  {selectedDayEvents.length === 1 ? "evento" : "eventi"}
                </span>
                <span className="rounded-full bg-[#dfe9df] px-3 py-1.5 text-[#4b6b4e]">
                  {selectedDayBookedCount} prenotati
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCalendarDay(null)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9573c]/20 bg-white text-[#c9573c]"
              aria-label="Chiudi riepilogo giorno"
            >
              <Icon icon="hugeicons:cancel-01" width="18" height="18" />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#77674E]">
                Eventi in calendario
              </h4>
              {selectedDayEvents.length ? (
                selectedDayEvents.map(({ event, date }) => {
                  const eventPayments = selectedDayPayments.filter(
                    (payment) => payment.event_slug === event.slug,
                  );
                  const eventBookedCount = eventPayments.reduce(
                    (sum, payment) => sum + getBookingAttendeeCount(payment),
                    0,
                  );
                  const dateSpots = Number(date?.spots || 0);
                  const remainingSpots = dateSpots
                    ? Math.max(dateSpots - eventBookedCount, 0)
                    : null;

                  return (
                    <article
                      key={`${event.slug}-${date.iso}`}
                      className="rounded-md border border-[#c9573c]/10 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9573c]/70">
                            {[date?.time, date?.recurringLabelIt]
                              .filter(Boolean)
                              .join(" - ") || date?.labelIt}
                          </p>
                          <h5 className="mt-1 text-lg font-bold text-[#2c395b]">
                            {event.title?.it || event.slug}
                          </h5>
                        </div>
                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                            event.status === "published"
                              ? "bg-[#dfe9df] text-[#4b6b4e]"
                              : "bg-[#f5e4d8] text-[#9c613d]"
                          }`}
                        >
                          {event.status === "published" ? "Live" : "Bozza"}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                        <div className="rounded-xl bg-[#fff8f4] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                            Prenotati
                          </p>
                          <p className="mt-1 text-xl font-bold text-[#2c395b]">
                            {eventBookedCount}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#fff8f4] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                            Disponibili
                          </p>
                          <p className="mt-1 text-xl font-bold text-[#2c395b]">
                            {remainingSpots ?? "-"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#fff8f4] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                            Checkout
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#2c395b]">
                            {date?.stripe?.enabled ? "Online" : "Email"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCalendarDay(null);
                            onSelectEvent(event);
                          }}
                          className="rounded-xl bg-[#2c395b] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Modifica evento
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCalendarDay(null);
                            onOpenPayments();
                          }}
                          className="rounded-xl border border-[#c9573c]/20 bg-white px-4 py-2 text-sm font-semibold text-[#c9573c]"
                        >
                          Vedi pagamenti
                        </button>
                        <button
                          type="button"
                          onClick={() => openManualBookingForm(event, date)}
                          disabled={remainingSpots === 0}
                          className="rounded-xl border border-[#2c395b]/15 bg-[#fff8f4] px-4 py-2 text-sm font-semibold text-[#2c395b] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Aggiungi bonifico
                        </button>
                      </div>
                      {manualBookingKey === `${event.slug}-${date.iso}` ? (
                        <form
                          className="mt-4 rounded-md border border-[#c9573c]/10 bg-[#fff8f4] p-4"
                          onSubmit={async (formEvent) => {
                            formEvent.preventDefault();
                            await submitManualBooking(event, date);
                          }}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9573c]/70">
                                Prenotazione manuale
                              </p>
                              <p className="mt-1 text-sm text-[#6d7b80]">
                                Per bonifico o pagamento fuori sito.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setManualBookingKey("")}
                              className="text-sm font-semibold text-[#c9573c]"
                            >
                              Chiudi
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="text-sm font-semibold text-[#2c395b]">
                              Email cliente
                              <input
                                type="email"
                                value={manualBookingForm.customerEmail}
                                onChange={(inputEvent) =>
                                  updateManualBookingField(
                                    "customerEmail",
                                    inputEvent.target.value,
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                                placeholder="nome@email.com"
                              />
                            </label>
                            <label className="text-sm font-semibold text-[#2c395b]">
                              Persone
                              <input
                                type="number"
                                min="1"
                                max={remainingSpots || MAX_EVENT_SPOTS}
                                required
                                value={manualBookingForm.attendeeCount}
                                onChange={(inputEvent) =>
                                  updateManualBookingField(
                                    "attendeeCount",
                                    inputEvent.target.value,
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                              />
                            </label>
                            <label className="text-sm font-semibold text-[#2c395b]">
                              Importo ricevuto
                              <input
                                type="text"
                                inputMode="decimal"
                                value={manualBookingForm.amountEuro}
                                onChange={(inputEvent) =>
                                  updateManualBookingField(
                                    "amountEuro",
                                    inputEvent.target.value,
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                                placeholder="45,00"
                              />
                            </label>
                            <label className="text-sm font-semibold text-[#2c395b]">
                              Nota
                              <input
                                type="text"
                                value={manualBookingForm.note}
                                onChange={(inputEvent) =>
                                  updateManualBookingField(
                                    "note",
                                    inputEvent.target.value,
                                  )
                                }
                                className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                                placeholder="Bonifico"
                              />
                            </label>
                            <label className="text-sm font-semibold text-[#2c395b] sm:col-span-2">
                              Nomi partecipanti
                              <textarea
                                value={manualBookingForm.attendeeNames}
                                onChange={(inputEvent) =>
                                  updateManualBookingField(
                                    "attendeeNames",
                                    inputEvent.target.value,
                                  )
                                }
                                className="mt-1 min-h-[78px] w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                                placeholder="Un nome per riga, oppure separati da virgola"
                              />
                            </label>
                          </div>
                          <button
                            type="submit"
                            disabled={manualBookingSaving}
                            className="mt-4 rounded-xl bg-[#2c395b] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {manualBookingSaving
                              ? "Salvataggio..."
                              : "Salva prenotazione"}
                          </button>
                        </form>
                      ) : null}
                    </article>
                  );
                })
              ) : (
                <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-white p-4 text-sm text-[#6d7b80]">
                  Nessun evento programmato in questo giorno.
                </p>
              )}
            </section>

            <aside className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#77674E]">
                Prenotazioni
              </h4>
              {selectedDayPayments.length ? (
                selectedDayPayments.map((payment) => {
                  const attendeeCount = getBookingAttendeeCount(payment);
                  const attendeeNames = getAttendeeNames(payment);
                  const customerEmail =
                    payment?.raw_payload?.customer_details?.email ||
                    payment.customer_email ||
                    "-";

                  return (
                    <div
                      key={payment.stripe_session_id}
                      className="rounded-md border border-[#c9573c]/10 bg-white p-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9573c]/70">
                        {payment.event_slug || "-"}
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-[#2c395b]">
                        {customerEmail}
                      </p>
                      <p className="mt-2 text-xs text-[#6d7b80]">
                        {attendeeCount}{" "}
                        {attendeeCount === 1 ? "persona" : "persone"}
                        {attendeeNames.length
                          ? ` - ${attendeeNames.join(", ")}`
                          : ""}
                      </p>
                      <p className="mt-2 text-sm font-bold text-[#2c395b]">
                        {formatMoneyFromCents(
                          payment.amount_total,
                          payment.currency,
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-white p-4 text-sm text-[#6d7b80]">
                  Nessuna prenotazione pagata per questo giorno.
                </p>
              )}
            </aside>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-[#c9573c]/10 pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedCalendarDay(null);
                onNewEvent();
              }}
              className="rounded-xl bg-[#c9573c] px-4 py-2 text-sm font-semibold text-white"
            >
              Nuovo evento
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCalendarDay(null);
                onOpenEvents();
              }}
              className="rounded-xl border border-[#c9573c]/20 bg-white px-4 py-2 text-sm font-semibold text-[#2c395b]"
            >
              Archivio eventi
            </button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}

function PaymentMobileCard({
  payment,
  isExpanded,
  onToggle,
  onToggleExcluded,
  isUpdatingExclusion,
}) {
  const attendeeNames = getAttendeeNames(payment);
  const attendeeCount = getBookingAttendeeCount(payment);
  const metadata = payment?.raw_payload?.metadata || {};
  const customerDetails = payment?.raw_payload?.customer_details || {};
  const eventDateLabel = getPaymentEventDateLabel(payment);
  const customerEmail = customerDetails.email || payment.customer_email || "-";
  const sessionId = String(payment.stripe_session_id || "");
  const paymentIsTest = isTestBooking(payment);

  return (
    <article className="rounded-md border border-[#c9573c]/10 bg-white p-4 shadow-[0_14px_30px_rgba(35,47,55,0.05)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
            {formatAdminDateTime(payment.created_at)}
          </p>
          <h4 className="mt-1 break-words text-lg font-bold leading-tight text-[#2c395b]">
            {payment.event_slug || "-"}
          </h4>
          <p className="mt-1 text-sm text-[#6d7b80]">{eventDateLabel}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-[#2c395b]">
            {formatMoneyFromCents(payment.amount_total, payment.currency)}
          </p>
          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              paymentIsTest
                ? "bg-[#f5e4d8] text-[#9c613d]"
                : payment.payment_status === "paid"
                ? "bg-[#dfe9df] text-[#4b6b4e]"
                : "bg-[#f5e4d8] text-[#9c613d]"
            }`}
          >
            {paymentIsTest ? "test escluso" : payment.payment_status || "-"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="rounded-md bg-[#fff8f4] p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#77674E]">
            Cliente
          </p>
          <p className="break-words font-semibold text-[#2c395b]">
            {customerEmail}
          </p>
          {customerDetails.name ? (
            <p className="mt-1 text-[#6d7b80]">{customerDetails.name}</p>
          ) : null}
        </div>

        <div className="rounded-md bg-[#fff8f4] p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#77674E]">
            Partecipanti
          </p>
          <p className="font-semibold text-[#2c395b]">
            {attendeeCount} {attendeeCount === 1 ? "persona" : "persone"}
          </p>
          <p className="mt-1 text-[#6d7b80]">
            {attendeeNames.length
              ? attendeeNames.join(", ")
              : "Nomi non inseriti"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#c9573c]/20 px-4 py-3 text-sm font-semibold text-[#2c395b] transition hover:bg-[#fff8f4]"
      >
        <Icon
          icon={
            isExpanded ? "hugeicons:arrow-up-01" : "hugeicons:arrow-down-01"
          }
          width="16"
          height="16"
        />
        {isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}
      </button>

      <button
        type="button"
        onClick={() => onToggleExcluded(payment, !paymentIsTest)}
        disabled={isUpdatingExclusion}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2c395b]/15 px-4 py-3 text-sm font-semibold text-[#2c395b] transition hover:bg-[#fff8f4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon
          icon={paymentIsTest ? "hugeicons:checkmark-circle-02" : "hugeicons:cancel-circle"}
          width="16"
          height="16"
        />
        {paymentIsTest ? "Reincludi nei conteggi" : "Escludi dai conteggi"}
      </button>

      {isExpanded ? (
        <div className="mt-4 space-y-3 rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-3 text-sm text-[#2c395b]">
          <p>
            <strong>ISO data:</strong>{" "}
            {metadata.eventDateIso || payment.event_date_iso || "-"}
          </p>
          <p>
            <strong>Lingua:</strong> {metadata.locale || "-"}
          </p>
          <p>
            <strong>Telefono:</strong> {customerDetails.phone || "-"}
          </p>
          <p>
            <strong>Nazione:</strong> {customerDetails.address?.country || "-"}
          </p>
          <p className="break-all">
            <strong>Sessione:</strong> {sessionId || "-"}
          </p>
          <p className="break-all">
            <strong>Payment Intent:</strong>{" "}
            {payment.stripe_payment_intent_id || "-"}
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState(() => buildEmptyForm());
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [heroFileName, setHeroFileName] = useState("");
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [payments, setPayments] = useState([]);
  const [expandedPaymentSessionId, setExpandedPaymentSessionId] = useState("");
  const [updatingPaymentExclusionId, setUpdatingPaymentExclusionId] =
    useState("");
  const [paymentsManualFormOpen, setPaymentsManualFormOpen] = useState(false);
  const [paymentsManualForm, setPaymentsManualForm] = useState({
    eventSlug: "",
    eventDateIso: "",
    ...EMPTY_MANUAL_BOOKING_FORM,
  });

  const stats = useMemo(() => {
    const published = events.filter((event) => event.status === "published");
    const drafts = events.filter((event) => event.status === "draft");
    const totalDates = events.reduce(
      (sum, event) => sum + (event.dates?.length || 0),
      0,
    );
    const featured = events.filter((event) => event.featured).length;

    return [
      {
        label: "Eventi pubblicati",
        value: published.length,
        note: `${totalDates} date in archivio`,
        icon: "hugeicons:calendar-03",
      },
      {
        label: "Eventi in bozza",
        value: drafts.length,
        note: "Pronti per revisione o publish",
        icon: "hugeicons:note-edit",
      },
      {
        label: "Eventi in evidenza",
        value: featured,
        note: "Mostrati come featured nel frontend",
        icon: "hugeicons:star",
      },
    ];
  }, [events]);

  const paymentStats = useMemo(() => {
    const countablePayments = payments.filter((item) => !isTestBooking(item));
    const successful = countablePayments.filter(isCountableBooking);
    const refunded = countablePayments.filter((item) =>
      String(item.payment_status || "").includes("refund"),
    );
    const totalCents = successful.reduce(
      (sum, item) => sum + Number(item.amount_total || 0),
      0,
    );

    return {
      count: countablePayments.length,
      successfulCount: successful.length,
      refundedCount: refunded.length,
      totalCents,
      testCount: payments.length - countablePayments.length,
    };
  }, [payments]);
  const manualBookingEventOptions = useMemo(
    () =>
      events
        .filter((event) => (event.dates || []).length > 0)
        .map((event) => ({
          slug: event.slug,
          title: event.title?.it || event.slug,
          dates: event.dates || [],
        })),
    [events],
  );
  const selectedManualBookingEvent = manualBookingEventOptions.find(
    (event) => event.slug === paymentsManualForm.eventSlug,
  );

  const clearAdminSession = useCallback((message = "") => {
    setAdminKey("");
    setAdminUser(null);
    setAuthPassword("");
    setEvents([]);
    setSelectedSlug("");
    setForm(buildEmptyForm());
    setNotice("");
    setError(message);
    setPayments([]);
  }, []);

  const handleLogout = useCallback(
    async ({ skipRemoteSignOut = false, message = "" } = {}) => {
      clearAdminSession(message);

      if (!skipRemoteSignOut) {
        await supabase.auth.signOut();
      }
    },
    [clearAdminSession],
  );

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (sessionError) {
          setError(sessionError.message || "Errore nel recupero sessione.");
        }

        const accessToken = data?.session?.access_token || "";
        const user = data?.session?.user || null;

        setAdminUser(user);

        if (accessToken) {
          setAdminKey(accessToken);
        }
      } finally {
        if (mounted) {
          setBooting(false);
        }
      }
    }

    bootstrapAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        const token = session?.access_token || "";
        const user = session?.user || null;
        setAdminKey(token);
        setAdminUser(user);

        if (!token) {
          clearAdminSession("");
        }
      },
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [clearAdminSession]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedEmail = window.localStorage.getItem("lou-admin-email") || "";

    if (savedEmail) {
      setAuthEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const loadEvents = useCallback(
    async (key = adminKey) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/events", {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (isSessionExpiredResponse(response, data)) {
            await handleLogout({
              skipRemoteSignOut: true,
              message: SESSION_EXPIRED_MESSAGE,
            });
            return;
          }
          throw new Error(data.error || "Errore nel caricamento eventi.");
        }

        const nextEvents = data.events || [];
        setEvents(nextEvents);

        if (selectedSlug) {
          const currentEvent = nextEvents.find(
            (event) => event.slug === selectedSlug,
          );

          if (currentEvent) {
            setForm(eventToForm(currentEvent));
          } else {
            setSelectedSlug("");
            setForm(buildEmptyForm());
          }
        } else if (nextEvents.length && activePanel !== "editor") {
          const firstEvent = nextEvents[0];
          setSelectedSlug(firstEvent.slug);
          setForm(eventToForm(firstEvent));
        }
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    },
    [activePanel, adminKey, handleLogout, selectedSlug],
  );

  const loadPayments = useCallback(
    async (key = adminKey) => {
      if (!key) {
        return;
      }

      setPaymentsLoading(true);

      try {
        const response = await fetch("/api/admin/payments", {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          if (isSessionExpiredResponse(response, data)) {
            await handleLogout({
              skipRemoteSignOut: true,
              message: SESSION_EXPIRED_MESSAGE,
            });
            return;
          }
          throw new Error(data.error || "Errore nel caricamento pagamenti.");
        }

        setPayments(data.payments || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setPaymentsLoading(false);
      }
    },
    [adminKey, handleLogout],
  );

  const updatePaymentExclusion = useCallback(
    async (payment, excluded) => {
      const stripeSessionId = String(payment?.stripe_session_id || "").trim();

      if (!adminKey || !stripeSessionId) {
        return;
      }

      setUpdatingPaymentExclusionId(stripeSessionId);
      setError("");
      setNotice("");

      try {
        const response = await fetch("/api/admin/payments", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminKey}`,
          },
          body: JSON.stringify({ stripeSessionId, excluded }),
        });
        const data = await response.json();

        if (!response.ok) {
          if (isSessionExpiredResponse(response, data)) {
            await handleLogout({
              skipRemoteSignOut: true,
              message: SESSION_EXPIRED_MESSAGE,
            });
            return;
          }
          throw new Error(data.error || "Errore aggiornamento pagamento.");
        }

        setPayments((current) =>
          current.map((item) =>
            item.stripe_session_id === stripeSessionId
              ? data.payment || item
              : item,
          ),
        );
        setNotice(
          excluded
            ? "Pagamento escluso dai conteggi."
            : "Pagamento reincluso nei conteggi.",
        );
      } catch (updateError) {
        setError(updateError.message);
      } finally {
        setUpdatingPaymentExclusionId("");
      }
    },
    [adminKey, handleLogout],
  );

  const createManualBooking = useCallback(
    async (payload) => {
      if (!adminKey) {
        return;
      }

      setPaymentsLoading(true);
      setError("");
      setNotice("");

      try {
        const response = await fetch("/api/admin/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminKey}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
          if (isSessionExpiredResponse(response, data)) {
            await handleLogout({
              skipRemoteSignOut: true,
              message: SESSION_EXPIRED_MESSAGE,
            });
            return;
          }
          throw new Error(data.error || "Errore creazione prenotazione.");
        }

        setPayments((current) => [data.payment, ...current].filter(Boolean));
        setNotice("Prenotazione manuale aggiunta ai conteggi.");
      } catch (createError) {
        setError(createError.message);
        throw createError;
      } finally {
        setPaymentsLoading(false);
      }
    },
    [adminKey, handleLogout],
  );
  const submitPaymentsManualBooking = useCallback(
    async (submitEvent) => {
      submitEvent.preventDefault();
      if (!paymentsManualForm.eventSlug || !paymentsManualForm.eventDateIso) {
        setError("Seleziona evento e data per il bonifico.");
        return;
      }

      await createManualBooking(paymentsManualForm);
      setPaymentsManualForm({
        eventSlug: paymentsManualForm.eventSlug,
        eventDateIso: paymentsManualForm.eventDateIso,
        ...EMPTY_MANUAL_BOOKING_FORM,
      });
    },
    [createManualBooking, paymentsManualForm],
  );

  useEffect(() => {
    if (!adminKey) {
      return;
    }

    loadEvents(adminKey);
    loadPayments(adminKey);
  }, [adminKey, loadEvents, loadPayments]);

  useEffect(() => {
    if (!adminKey || typeof window === "undefined") {
      return undefined;
    }

    let cancelled = false;

    const checkSessionOnFocus = async () => {
      const { data } = await supabase.auth.getSession();

      if (cancelled) {
        return;
      }

      if (!data?.session?.access_token) {
        await handleLogout({
          skipRemoteSignOut: true,
          message: SESSION_EXPIRED_MESSAGE,
        });
      }
    };

    window.addEventListener("focus", checkSessionOnFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", checkSessionOnFocus);
    };
  }, [adminKey, handleLogout]);

  async function handleLogin(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    const email = authEmail.trim();

    if (!email || !authPassword.trim()) {
      setError("Inserisci email e password.");
      return;
    }

    setAuthLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password: authPassword,
        });

      if (loginError) {
        throw new Error(loginError.message || "Login non riuscito.");
      }

      const accessToken = data?.session?.access_token || "";
      const user = data?.user || data?.session?.user || null;

      if (!accessToken) {
        setNotice(
          "Controlla la tua email e conferma l'account prima di accedere.",
        );
        return;
      }

      setAdminKey(accessToken);
      setAdminUser(user);
      if (typeof window !== "undefined") {
        if (rememberEmail) {
          window.localStorage.setItem("lou-admin-email", email);
        } else {
          window.localStorage.removeItem("lou-admin-email");
        }
      }
      setNotice("Accesso admin effettuato.");
    } catch (loginError) {
      setError(loginError.message || "Login non riuscito.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister() {
    setNotice("");
    setError("");

    const fullName = authName.trim();
    const email = authEmail.trim();

    if (!fullName || !email || !authPassword.trim()) {
      setError("Inserisci nome, email e password.");
      return;
    }

    setAuthLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/admin`
          : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: authPassword,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Registrazione non riuscita.");
      }

      const accessToken = data?.session?.access_token || "";
      const user = data?.user || data?.session?.user || null;

      if (accessToken) {
        setAdminKey(accessToken);
        setAdminUser(user);
        setNotice("Account creato e accesso effettuato.");
      } else {
        setNotice(
          "Account creato. Controlla la tua email, conferma l'indirizzo e poi accedi.",
        );
      }
    } catch (signUpError) {
      setError(signUpError.message || "Registrazione non riuscita.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleResetPasswordEmail() {
    setNotice("");
    setError("");

    const email = authEmail.trim();

    if (!email) {
      setError("Inserisci prima la tua email per ricevere il reset password.");
      return;
    }

    setAuthLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/admin/reset-password`
          : undefined;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        },
      );

      if (resetError) {
        throw new Error(
          resetError.message || "Invio email reset password non riuscito.",
        );
      }

      setNotice(
        "Email inviata. Apri il link ricevuto e imposta una nuova password.",
      );
    } catch (resetError) {
      setError(
        resetError.message || "Invio email reset password non riuscito.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleResendConfirmationEmail() {
    setNotice("");
    setError("");

    const email = authEmail.trim();

    if (!email) {
      setError("Inserisci prima la tua email.");
      return;
    }

    setAuthLoading(true);

    try {
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/admin`
          : undefined;

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo,
        },
      });

      if (resendError) {
        throw new Error(
          resendError.message || "Reinvio email di conferma non riuscito.",
        );
      }

      setNotice(
        "Email di conferma reinviata. Controlla anche Spam/Promozioni.",
      );
    } catch (resendError) {
      setError(
        resendError.message || "Reinvio email di conferma non riuscito.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function startNewEvent() {
    setSelectedSlug("");
    setForm(buildEmptyForm());
    setActivePanel("editor");
    setNotice("");
    setError("");
  }

  function handleSelectEvent(event) {
    setSelectedSlug(event.slug);
    setForm(eventToForm(event));
    setActivePanel("editor");
    setNotice("");
    setError("");
  }

  function updateFormField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateDateField(id, field, value) {
    setForm((current) => ({
      ...current,
      dates: current.dates.map((date) => {
        if (date.id !== id) {
          return date;
        }

        const nextDate = {
          ...date,
          [field]: value,
        };

        if (field === "date") {
          nextDate.labelIt = formatDateLabel(value, "it");
          nextDate.labelEn = formatDateLabel(value, "en");
        }

        return nextDate;
      }),
    }));
  }

  function addDateRow() {
    setForm((current) => {
      const lastDate = current.dates[current.dates.length - 1] || {};

      return {
        ...current,
        dates: [
          ...current.dates,
          createDateEntry({
            stripeEnabled: Boolean(lastDate.stripeEnabled),
            stripePriceEuro: lastDate.stripePriceEuro || "",
            stripeCurrency: lastDate.stripeCurrency || "eur",
          }),
        ],
      };
    });
  }

  function removeDateRow(id) {
    setForm((current) => {
      const nextDates = current.dates.filter((date) => date.id !== id);

      return {
        ...current,
        dates: nextDates.length ? nextDates : [createDateEntry()],
      };
    });
  }

  function autofillDateLabels(id) {
    setForm((current) => ({
      ...current,
      dates: current.dates.map((date) => {
        if (date.id !== id || !date.date) {
          return date;
        }

        return {
          ...date,
          labelIt: formatDateLabel(date.date, "it"),
          labelEn: formatDateLabel(date.date, "en"),
        };
      }),
    }));
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setHeroFileName(file.name || "");
    setUploadingImage(true);
    setError("");
    setNotice("");

    try {
      const url = await uploadEventImage(file, adminKey);
      updateFormField("heroImage", url);
      setNotice("Immagine caricata correttamente.");
    } catch (uploadError) {
      setError(uploadError.message || "Upload immagine non riuscito.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setUploadingGallery(true);
    setError("");
    setNotice("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const url = await uploadEventImage(file, adminKey);
        uploadedUrls.push(url);
      }

      setForm((current) => {
        const existing = splitLines(current.galleryText);
        const nextGallery = [...existing, ...uploadedUrls];

        return {
          ...current,
          galleryText: nextGallery.join("\n"),
        };
      });

      setNotice(
        `${uploadedUrls.length} immagini caricate e aggiunte alla galleria.`,
      );
    } catch (uploadError) {
      setError(uploadError.message || "Upload galleria non riuscito.");
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  }

  async function handleSave(nextStatus) {
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = formToPayload({
        ...form,
        status: nextStatus,
      });

      const isEditing = Boolean(selectedSlug);
      const response = await fetch(
        isEditing ? `/api/admin/events/${selectedSlug}` : "/api/admin/events",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminKey}`,
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        if (isSessionExpiredResponse(response, data)) {
          await handleLogout({
            skipRemoteSignOut: true,
            message: SESSION_EXPIRED_MESSAGE,
          });
          return;
        }
        throw new Error(data.error || "Salvataggio non riuscito.");
      }

      setNotice(
        nextStatus === "published"
          ? "Evento salvato e pubblicato."
          : "Bozza salvata correttamente.",
      );

      await loadEvents(adminKey);
      setSelectedSlug(data.event.slug);
      setForm(eventToForm(data.event));
      setActivePanel("events");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedSlug) {
      return;
    }

    const confirmed =
      typeof window === "undefined"
        ? false
        : window.confirm("Vuoi eliminare questo evento?");

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/events/${selectedSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminKey}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (isSessionExpiredResponse(response, data)) {
          await handleLogout({
            skipRemoteSignOut: true,
            message: SESSION_EXPIRED_MESSAGE,
          });
          return;
        }
        throw new Error(data.error || "Eliminazione non riuscita.");
      }

      setNotice("Evento eliminato.");
      setSelectedSlug("");
      setForm(buildEmptyForm());
      await loadEvents(adminKey);
      setActivePanel("events");
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setLoading(false);
    }
  }

  if (booting) {
    return null;
  }

  if (!adminKey) {
    return (
      <>
        <Head>
          <title>Dashboard Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fef3ea_0%,#fff8f4_52%,#f6eee8_100%)] px-4 py-10">
          <section className="w-full max-w-xl rounded-md border border-[#c9573c]/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(35,47,55,0.08)] backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
              Luisa Quaglia Tour Guide
            </p>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-[#2c395b]">
              Accesso admin
            </h1>
            <p className="mb-6 text-base leading-7 text-[#6d7b80]">
              {authMode === "login"
                ? "Accedi con email e password Supabase."
                : "Crea il tuo account admin con nome, email e password."}
            </p>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#fef3ea] p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setError("");
                  setNotice("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  authMode === "login"
                    ? "bg-white text-[#2c395b] shadow-sm"
                    : "text-[#6d7b80] hover:text-[#2c395b]"
                }`}
              >
                Accedi
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setError("");
                  setNotice("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  authMode === "register"
                    ? "bg-white text-[#2c395b] shadow-sm"
                    : "text-[#6d7b80] hover:text-[#2c395b]"
                }`}
              >
                Crea account
              </button>
            </div>

            <form
              onSubmit={
                authMode === "login"
                  ? handleLogin
                  : (event) => {
                      event.preventDefault();
                      handleRegister();
                    }
              }
              className="space-y-4"
            >
              {authMode === "register" ? (
                <Field label="Nome">
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="Il tuo nome"
                    className={baseInputClass()}
                  />
                </Field>
              ) : null}

              <Field label="Email admin">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="admin@dominio.com"
                  className={baseInputClass()}
                />
              </Field>

              <Field label="Password">
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={
                      authMode === "login" ? "current-password" : "new-password"
                    }
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                    placeholder="Inserisci la password"
                    className={`${baseInputClass()} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="inline-flex items-center justify-center rounded-xl border border-[#c9573c]/20 bg-[#fef3ea] px-3 py-3 text-xs font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                  >
                    {showPassword ? "Nascondi" : "Mostra"}
                  </button>
                </div>
              </Field>

              {authMode === "login" ? (
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#2c395b]">
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(event) => setRememberEmail(event.target.checked)}
                    className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                  />
                  Ricordami su questo dispositivo
                </label>
              ) : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43] disabled:opacity-60"
                >
                  <Icon
                    icon="hugeicons:square-lock-02"
                    width="18"
                    height="18"
                  />
                  {authMode === "login" ? "Accedi" : "Crea account"}
                </button>

                {authMode === "register" ? (
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => setAuthMode("login")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9573c]/20 bg-[#fef3ea] px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10 disabled:opacity-60"
                  >
                    Torna al login
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => setAuthMode("register")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9573c]/20 bg-[#fef3ea] px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10 disabled:opacity-60"
                  >
                    <Icon
                      icon="hugeicons:user-plus-01"
                      width="18"
                      height="18"
                    />
                    Crea account
                  </button>
                )}
              </div>

              {authMode === "login" ? (
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleResetPasswordEmail}
                    className="text-sm font-semibold text-[#2c395b] underline underline-offset-4 transition hover:text-[#c9573c] disabled:opacity-60"
                  >
                    Password dimenticata?
                  </button>
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleResendConfirmationEmail}
                    className="text-sm font-semibold text-[#2c395b] underline underline-offset-4 transition hover:text-[#c9573c] disabled:opacity-60"
                  >
                    Reinvia email di conferma
                  </button>
                </div>
              ) : null}
            </form>

            <div className="mt-6 rounded-md bg-[#fff8f4] p-4 text-sm leading-6 text-[#6d7b80]">
              In Supabase lascia attivo il provider Email e la conferma email.
              Per limitare gli accessi all&apos;area admin imposta{" "}
              <code>ADMIN_ALLOWED_EMAILS</code>.
            </div>
          </section>
        </main>
      </>
    );
  }

  const showOverview = activePanel === "overview";
  const showEvents = activePanel === "events";
  const showEditor = activePanel === "editor";
  const showPayments = activePanel === "payments";

  function handleNavSelect(panelId) {
    setActivePanel(panelId);
    setMobileNavOpen(false);
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta
          name="description"
          content="Dashboard admin per la gestione di eventi, date e pubblicazione."
        />
      </Head>

      <div className="min-h-screen bg-[linear-gradient(180deg,#fef3ea_0%,#fff8f4_52%,#f6eee8_100%)] text-[#232f37]">
        <div className="sticky top-0 z-[80] flex items-center justify-between border-b border-[#c9573c]/10 bg-[#fef3ea]/95 px-4 py-3 backdrop-blur-md xl:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#c9573c]/20 bg-white text-[#c9573c]"
            aria-label="Apri menu admin"
          >
            <Icon icon="hugeicons:menu-01" width="22" height="22" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c9573c]/70">
              Admin
            </p>
            <p className="text-sm font-bold text-[#2c395b]">
              {NAV_ITEMS.find((item) => item.id === activePanel)?.label ||
                "Dashboard"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              loadEvents(adminKey);
              loadPayments(adminKey);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#c9573c]/20 bg-white text-[#c9573c]"
            aria-label="Ricarica dati"
          >
            <Icon icon="hugeicons:refresh" width="20" height="20" />
          </button>
        </div>

        {mobileNavOpen ? (
          <button
            type="button"
            aria-label="Chiudi menu admin"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-[90] bg-[#232f37]/35 backdrop-blur-[2px] xl:hidden"
          />
        ) : null}

        <div
          className={`grid min-h-screen w-full grid-cols-1 transition-[grid-template-columns] duration-300 ${
            sidebarCollapsed
              ? "xl:grid-cols-[92px_minmax(0,1fr)]"
              : "xl:grid-cols-[320px_minmax(0,1fr)]"
          }`}
        >
          <aside
            className={`fixed inset-y-0 left-0 z-[100] w-[min(86vw,340px)] border-r border-[#c9573c]/10 bg-[#fef3ea]/95 px-4 py-6 shadow-[24px_0_60px_rgba(35,47,55,0.16)] backdrop-blur-md transition-transform duration-300 sm:px-6 xl:sticky xl:top-0 xl:z-30 xl:w-auto xl:min-h-screen xl:translate-x-0 xl:px-4 xl:shadow-none ${
              mobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } ${sidebarCollapsed ? "xl:px-3" : "xl:px-5"}`}
          >
            <div
              className={`mb-8 flex flex-col gap-4 ${
                sidebarCollapsed ? "xl:items-center" : ""
              }`}
            >
              <div
                className={`flex items-start justify-between gap-3 ${
                  sidebarCollapsed ? "xl:justify-center" : ""
                }`}
              >
                <div className={sidebarCollapsed ? "xl:hidden" : ""}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
                    Luisa Quaglia
                  </p>
                  <h1 className="text-3xl font-bold leading-tight text-[#2c395b] sm:text-4xl">
                    Admin
                    <br />
                    Dashboard
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9573c]/20 bg-white text-[#c9573c] xl:hidden"
                  aria-label="Chiudi menu admin"
                >
                  <Icon icon="hugeicons:cancel-01" width="20" height="20" />
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed((current) => !current)}
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#c9573c]/20 bg-white text-[#c9573c] xl:inline-flex"
                  aria-label={
                    sidebarCollapsed
                      ? "Espandi barra laterale"
                      : "Comprimi barra laterale"
                  }
                >
                  <Icon
                    icon={
                      sidebarCollapsed
                        ? "hugeicons:sidebar-right-01"
                        : "hugeicons:sidebar-left-01"
                    }
                    width="20"
                    height="20"
                  />
                </button>
              </div>

              <div
                className={`flex flex-wrap items-center gap-2 ${
                  sidebarCollapsed ? "xl:justify-center" : ""
                }`}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c9573c]/15 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2c395b]">
                  <Icon icon="hugeicons:user-account" width="14" height="14" />
                  <span className={sidebarCollapsed ? "xl:hidden" : ""}>
                    {getAdminDisplayName(adminUser) || "Admin"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-[#c9573c]/20 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]"
                >
                  <Icon icon="hugeicons:logout-03" width="14" height="14" />
                  <span className={sidebarCollapsed ? "xl:hidden" : ""}>
                    Esci
                  </span>
                </button>
              </div>
            </div>

            <nav className="grid gap-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavSelect(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-left transition ${
                    activePanel === item.id
                      ? "bg-[#77674E] text-white shadow-[0_18px_30px_rgba(119,103,78,0.18)]"
                      : "bg-white/75 text-[#2c395b] hover:bg-[#CE9486]/10"
                  } ${sidebarCollapsed ? "xl:justify-center xl:px-3" : ""}`}
                >
                  <Icon icon={item.icon} width="20" height="20" />
                  <span
                    className={`text-sm font-semibold tracking-wide ${
                      sidebarCollapsed ? "xl:hidden" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            <div
              className={`mt-8 rounded-md bg-[#2c395b] p-5 text-[#fef3ea] ${
                sidebarCollapsed ? "xl:hidden" : ""
              }`}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#fef3ea]/70">
                Step utile adesso
              </p>
              <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
                Eventi e pagamenti da admin.
              </h2>
              <p className="text-sm leading-6 text-[#fef3ea]/78">
                Gestisci archivio, date, posti e checkout online da un solo
                pannello.
              </p>
            </div>
          </aside>

          <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-8">
            <div className="mx-auto w-full max-w-[2200px]">
              <header className="mb-8 rounded-md border border-[#c9573c]/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(35,47,55,0.06)] backdrop-blur-sm lg:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-4xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c9573c]/15 bg-[#fff8f4] px-3 py-1.5 text-xs font-semibold text-[#77674E]">
                      <Icon
                        icon="hugeicons:user-account"
                        width="14"
                        height="14"
                      />
                      Benvenuta/o, {getAdminDisplayName(adminUser) || "Admin"}
                    </div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
                      Backend eventi attivo
                    </p>
                    <h2 className="mb-3 text-3xl font-bold leading-tight text-[#2c395b] sm:text-4xl xl:text-5xl">
                      Aggiungi, modifica e pubblica da un solo posto.
                    </h2>
                    <p className="text-base leading-7 text-[#6d7b80] lg:text-lg">
                      L&apos;editor usa campi veri per date, posti, meeting
                      point e pagamenti, cosi puoi mantenere gli eventi sempre
                      aggiornati.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row xl:flex-col xl:min-w-[220px]">
                    <button
                      type="button"
                      onClick={startNewEvent}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43]"
                    >
                      <Icon
                        icon="hugeicons:add-circle"
                        width="18"
                        height="18"
                      />
                      Nuovo evento
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loadEvents(adminKey);
                        loadPayments(adminKey);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9573c]/20 bg-[#fef3ea] px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                    >
                      <Icon icon="hugeicons:refresh" width="18" height="18" />
                      Ricarica dati
                    </button>
                  </div>
                </div>
              </header>

              {error ? (
                <div className="mb-6 rounded-md border border-[#c9573c]/20 bg-[#fff1ec] px-5 py-4 text-sm font-medium text-[#b74d33]">
                  {error}
                </div>
              ) : null}

              {notice ? (
                <div className="mb-6 rounded-md border border-[#4b6b4e]/20 bg-[#edf7ee] px-5 py-4 text-sm font-medium text-[#4b6b4e]">
                  {notice}
                </div>
              ) : null}

              <section className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 2xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatsCard key={stat.label} {...stat} />
                ))}
              </section>

              {showOverview ? (
                <OverviewPanel
                  events={events}
                  payments={payments}
                  paymentStats={paymentStats}
                  loading={loading || paymentsLoading}
                  onNewEvent={startNewEvent}
                  onOpenEvents={() => handleNavSelect("events")}
                  onOpenEditor={() => handleNavSelect("editor")}
                  onOpenPayments={() => handleNavSelect("payments")}
                  onSelectEvent={handleSelectEvent}
                  onCreateManualBooking={createManualBooking}
                />
              ) : null}

              <div className="space-y-6">
                {showEvents ? (
                  <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
                    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                          Archivio eventi
                        </p>
                        <h3 className="text-3xl font-bold text-[#2c395b]">
                          Eventi salvati
                        </h3>
                      </div>
                      {loading ? (
                        <span className="text-sm font-semibold text-[#77674E]">
                          Caricamento...
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      {events.length ? (
                        events.map((event) => {
                          const firstDate = event.dates?.[0];
                          const statusLabel =
                            event.status === "published"
                              ? "Pubblicato"
                              : "Bozza";
                          return (
                            <div
                              key={event.slug}
                              className="grid gap-4 rounded-md border border-[#c9573c]/10 bg-[#fff8f4] p-5 lg:grid-cols-[1fr_auto]"
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span
                                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                                      event.status === "published"
                                        ? "bg-[#dfe9df] text-[#4b6b4e]"
                                        : "bg-[#f5e4d8] text-[#9c613d]"
                                    }`}
                                  >
                                    {statusLabel}
                                  </span>
                                  {event.featured ? (
                                    <span className="rounded-full bg-[#CE9486]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]">
                                      Featured
                                    </span>
                                  ) : null}
                                  <span className="text-sm font-semibold text-[#77674E]">
                                    {event.location?.it || "-"}
                                  </span>
                                </div>

                                <h4 className="mb-2 text-2xl font-bold text-[#2c395b]">
                                  {event.title?.it || event.slug}
                                </h4>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6d7b80]">
                                  <span className="inline-flex items-center gap-2">
                                    <Icon
                                      icon="hugeicons:calendar-03"
                                      width="16"
                                      height="16"
                                    />
                                    {firstDate?.labelIt || "Nessuna data"}
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <Icon
                                      icon="hugeicons:clock-01"
                                      width="16"
                                      height="16"
                                    />
                                    {firstDate?.time || "Da definire"}
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <Icon
                                      icon="hugeicons:wallet-02"
                                      width="16"
                                      height="16"
                                    />
                                    {event.price?.it || "-"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-start justify-between gap-3 lg:items-end">
                                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#77674E] shadow-sm">
                                  {(event.dates || []).length} date
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectEvent(event)}
                                    className="rounded-xl border border-[#c9573c]/20 px-4 py-2 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                                  >
                                    Modifica
                                  </button>
                                  <a
                                    href={`/eventi/${event.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl bg-[#77674E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#685b43]"
                                  >
                                    Apri
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-6 text-sm leading-7 text-[#6d7b80]">
                          Nessun evento salvato ancora. Crea il primo da qui
                          sopra con “Nuovo evento”.
                        </div>
                      )}
                    </div>
                  </article>
                ) : null}

                {showEditor ? (
                  <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
                    <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                          Editor evento
                        </p>
                        <h3 className="text-3xl font-bold text-[#2c395b]">
                          {selectedSlug
                            ? "Modifica evento"
                            : "Crea nuovo evento"}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateFormField(
                              "slug",
                              form.slug || buildSlugFromTitle(form.titleIt),
                            )
                          }
                          className="rounded-xl border border-[#c9573c]/20 px-4 py-2 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                        >
                          Genera slug
                        </button>

                        {selectedSlug ? (
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-xl border border-[#b74d33]/20 px-4 py-2 text-sm font-semibold text-[#b74d33] transition hover:bg-[#fff1ec]"
                          >
                            Elimina evento
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                      }}
                      className="grid grid-cols-1 gap-4 xl:grid-cols-2"
                    >
                      <Field label="Slug">
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(event) =>
                            updateFormField("slug", event.target.value)
                          }
                          placeholder="es. siena-al-tramonto"
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Hero image">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                          disabled={uploadingImage}
                          className={baseInputClass()}
                        />
                        <p className="text-xs text-[#6d7b80]">
                          {uploadingImage
                            ? "Upload in corso..."
                            : form.heroImage
                              ? "Immagine collegata all'evento."
                              : "Seleziona un file per caricare la hero image."}
                        </p>
                        {heroFileName || form.heroImage ? (
                          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#c9573c]/15 bg-[#fff8f4] px-3 py-1 text-xs font-semibold text-[#2c395b]">
                            <Icon
                              icon="hugeicons:image-01"
                              width="14"
                              height="14"
                              className="shrink-0"
                            />
                            <span className="truncate">
                              {heroFileName ||
                                getFileNameFromUrl(form.heroImage) ||
                                "File hero collegato"}
                            </span>
                          </div>
                        ) : null}
                      </Field>

                      <Field label="Titolo IT">
                        <input
                          type="text"
                          value={form.titleIt}
                          onChange={(event) =>
                            updateFormField("titleIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Titolo EN">
                        <input
                          type="text"
                          value={form.titleEn}
                          onChange={(event) =>
                            updateFormField("titleEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Categoria IT">
                        <input
                          type="text"
                          value={form.categoryIt}
                          onChange={(event) =>
                            updateFormField("categoryIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Categoria EN">
                        <input
                          type="text"
                          value={form.categoryEn}
                          onChange={(event) =>
                            updateFormField("categoryEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Excerpt IT" className="xl:col-span-2">
                        <textarea
                          value={form.excerptIt}
                          onChange={(event) =>
                            updateFormField("excerptIt", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field label="Excerpt EN" className="xl:col-span-2">
                        <textarea
                          value={form.excerptEn}
                          onChange={(event) =>
                            updateFormField("excerptEn", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field label="Location IT">
                        <input
                          type="text"
                          value={form.locationIt}
                          onChange={(event) =>
                            updateFormField("locationIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Location EN">
                        <input
                          type="text"
                          value={form.locationEn}
                          onChange={(event) =>
                            updateFormField("locationEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Durata IT">
                        <input
                          type="text"
                          value={form.durationIt}
                          onChange={(event) =>
                            updateFormField("durationIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Durata EN">
                        <input
                          type="text"
                          value={form.durationEn}
                          onChange={(event) =>
                            updateFormField("durationEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Prezzo IT">
                        <input
                          type="text"
                          value={form.priceIt}
                          onChange={(event) =>
                            updateFormField("priceIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Prezzo EN">
                        <input
                          type="text"
                          value={form.priceEn}
                          onChange={(event) =>
                            updateFormField("priceEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Punto di ritrovo IT">
                        <input
                          type="text"
                          value={form.meetingPointIt}
                          onChange={(event) =>
                            updateFormField(
                              "meetingPointIt",
                              event.target.value,
                            )
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Punto di ritrovo EN">
                        <input
                          type="text"
                          value={form.meetingPointEn}
                          onChange={(event) =>
                            updateFormField(
                              "meetingPointEn",
                              event.target.value,
                            )
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Link Google Maps IT">
                        <input
                          type="text"
                          value={form.meetingPointLinkIt}
                          onChange={(event) =>
                            updateFormField(
                              "meetingPointLinkIt",
                              event.target.value,
                            )
                          }
                          placeholder="https://maps.app.goo.gl/..."
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Link Google Maps EN">
                        <input
                          type="text"
                          value={form.meetingPointLinkEn}
                          onChange={(event) =>
                            updateFormField(
                              "meetingPointLinkEn",
                              event.target.value,
                            )
                          }
                          placeholder="https://maps.app.goo.gl/..."
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Lingue IT">
                        <input
                          type="text"
                          value={form.languagesIt}
                          onChange={(event) =>
                            updateFormField("languagesIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Lingue EN">
                        <input
                          type="text"
                          value={form.languagesEn}
                          onChange={(event) =>
                            updateFormField("languagesEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Ricorrenza IT">
                        <input
                          type="text"
                          value={form.recurringIt}
                          onChange={(event) =>
                            updateFormField("recurringIt", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field label="Ricorrenza EN">
                        <input
                          type="text"
                          value={form.recurringEn}
                          onChange={(event) =>
                            updateFormField("recurringEn", event.target.value)
                          }
                          className={baseInputClass()}
                        />
                      </Field>

                      <Field
                        label="Gallery immagini (una per riga)"
                        className="xl:col-span-2"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          disabled={uploadingGallery}
                          className={`${baseInputClass()} mb-3`}
                        />
                        <p className="mb-3 text-xs text-[#6d7b80]">
                          {uploadingGallery
                            ? "Upload galleria in corso..."
                            : "Puoi selezionare piu immagini insieme: gli URL vengono aggiunti automaticamente qui sotto."}
                        </p>
                        <textarea
                          value={form.galleryText}
                          onChange={(event) =>
                            updateFormField("galleryText", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field
                        label="Inclusi IT (uno per riga)"
                        className="xl:col-span-2"
                      >
                        <textarea
                          value={form.includedIt}
                          onChange={(event) =>
                            updateFormField("includedIt", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field
                        label="Inclusi EN (uno per riga)"
                        className="xl:col-span-2"
                      >
                        <textarea
                          value={form.includedEn}
                          onChange={(event) =>
                            updateFormField("includedEn", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field
                        label="Descrizione IT (paragrafi separati da riga vuota)"
                        className="xl:col-span-2"
                      >
                        <textarea
                          value={form.descriptionIt}
                          onChange={(event) =>
                            updateFormField("descriptionIt", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <Field
                        label="Descrizione EN (paragrafi separati da riga vuota)"
                        className="xl:col-span-2"
                      >
                        <textarea
                          value={form.descriptionEn}
                          onChange={(event) =>
                            updateFormField("descriptionEn", event.target.value)
                          }
                          className={baseInputClass(true)}
                        />
                      </Field>

                      <div className="xl:col-span-2">
                        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#2c395b]">
                              Date evento
                            </p>
                            <p className="text-sm text-[#6d7b80]">
                              Inserisci giorno, fascia oraria, label e posti
                              senza scrivere stringhe manuali.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={addDateRow}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#c9573c]/20 px-4 py-2 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                          >
                            <Icon
                              icon="hugeicons:add-square"
                              width="16"
                              height="16"
                            />
                            Aggiungi data
                          </button>
                        </div>

                        <div className="space-y-4">
                          {form.dates.map((date, index) => (
                            <div
                              key={date.id}
                              className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-4"
                            >
                              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-[#2c395b]">
                                    Data #{index + 1}
                                  </p>
                                  <p className="text-xs uppercase tracking-[0.22em] text-[#c9573c]/70">
                                    Dettagli data
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => autofillDateLabels(date.id)}
                                    className="rounded-xl border border-[#c9573c]/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9573c] transition hover:bg-[#CE9486]/10"
                                  >
                                    Auto label
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeDateRow(date.id)}
                                    className="rounded-xl border border-[#b74d33]/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b74d33] transition hover:bg-[#fff1ec]"
                                  >
                                    Rimuovi
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                                <Field label="Giorno">
                                  <input
                                    type="date"
                                    value={date.date}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "date",
                                        event.target.value,
                                      )
                                    }
                                    className={baseInputClass()}
                                  />
                                </Field>

                                <Field label="Inizio">
                                  <input
                                    type="time"
                                    value={date.startTime}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "startTime",
                                        event.target.value,
                                      )
                                    }
                                    className={baseInputClass()}
                                  />
                                </Field>

                                <Field label="Fine">
                                  <input
                                    type="time"
                                    value={date.endTime}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "endTime",
                                        event.target.value,
                                      )
                                    }
                                    className={baseInputClass()}
                                  />
                                </Field>

                                <Field label="Posti">
                                  <input
                                    type="number"
                                    min={MIN_EVENT_SPOTS}
                                    max={MAX_EVENT_SPOTS}
                                    value={date.spots}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "spots",
                                        event.target.value,
                                      )
                                    }
                                    className={baseInputClass()}
                                  />
                                  <p className="text-xs text-[#6d7b80]">
                                    Min {MIN_EVENT_SPOTS} - Max{" "}
                                    {MAX_EVENT_SPOTS}.
                                  </p>
                                </Field>

                                <div className="rounded-xl border border-[#c9573c]/10 bg-white px-4 py-3">
                                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#2c395b]">
                                    <input
                                      type="checkbox"
                                      checked={date.stripeEnabled}
                                      onChange={(event) =>
                                        updateDateField(
                                          date.id,
                                          "stripeEnabled",
                                          event.target.checked,
                                        )
                                      }
                                      className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                                    />
                                    Pagamento Stripe
                                  </label>
                                  <p className="mt-2 text-xs text-[#6d7b80]">
                                    Attiva checkout online per questa data.
                                  </p>
                                  {date.stripeEnabled ? (
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.50"
                                        value={date.stripePriceEuro}
                                        onChange={(event) =>
                                          updateDateField(
                                            date.id,
                                            "stripePriceEuro",
                                            event.target.value,
                                          )
                                        }
                                        placeholder="35.00"
                                        className={baseInputClass()}
                                      />
                                      <select
                                        value={date.stripeCurrency}
                                        onChange={(event) =>
                                          updateDateField(
                                            date.id,
                                            "stripeCurrency",
                                            event.target.value,
                                          )
                                        }
                                        className={baseInputClass()}
                                      >
                                        <option value="eur">EUR</option>
                                        <option value="usd">USD</option>
                                        <option value="gbp">GBP</option>
                                      </select>
                                    </div>
                                  ) : null}
                                </div>

                                <Field
                                  label="Label IT"
                                  className="xl:col-span-2"
                                >
                                  <input
                                    type="text"
                                    value={date.labelIt}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "labelIt",
                                        event.target.value,
                                      )
                                    }
                                    placeholder="14 giugno 2026"
                                    className={baseInputClass()}
                                  />
                                </Field>

                                <Field
                                  label="Label EN"
                                  className="xl:col-span-3"
                                >
                                  <input
                                    type="text"
                                    value={date.labelEn}
                                    onChange={(event) =>
                                      updateDateField(
                                        date.id,
                                        "labelEn",
                                        event.target.value,
                                      )
                                    }
                                    placeholder="June 14, 2026"
                                    className={baseInputClass()}
                                  />
                                </Field>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 xl:col-span-2">
                        <label className="inline-flex items-center gap-3 rounded-xl border border-[#c9573c]/15 bg-[#fffaf7] px-4 py-3 text-sm font-semibold text-[#2c395b]">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(event) =>
                              updateFormField("featured", event.target.checked)
                            }
                            className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                          />
                          Featured in homepage/events
                        </label>

                        <select
                          value={form.status}
                          onChange={(event) =>
                            updateFormField("status", event.target.value)
                          }
                          className={baseInputClass()}
                        >
                          <option value="draft">Bozza</option>
                          <option value="published">Pubblicato</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-3 pt-2 xl:col-span-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSave("draft")}
                          className="rounded-xl border border-[#c9573c]/20 px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10 disabled:opacity-50"
                        >
                          Salva bozza
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleSave("published")}
                          className="rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43] disabled:opacity-50"
                        >
                          Pubblica evento
                        </button>
                      </div>
                    </form>
                  </article>
                ) : null}

                {showPayments ? (
                  <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
                    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                          Stripe
                        </p>
                        <h3 className="text-3xl font-bold text-[#2c395b]">
                          Pagamenti
                        </h3>
                      </div>
                      {paymentsLoading ? (
                        <span className="text-sm font-semibold text-[#77674E]">
                          Caricamento...
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4">
                      <StatsCard
                        label="Transazioni"
                        value={paymentStats.count}
                        note={
                          paymentStats.testCount
                            ? `${paymentStats.testCount} test esclusi`
                            : "Ultime 300 da Stripe webhook"
                        }
                        icon="hugeicons:credit-card"
                      />
                      <StatsCard
                        label="Pagate"
                        value={paymentStats.successfulCount}
                        note="Sessioni completate"
                        icon="hugeicons:checkmark-circle-02"
                      />
                      <StatsCard
                        label="Rimborsi"
                        value={paymentStats.refundedCount}
                        note="Stati con refund"
                        icon="hugeicons:invoice-02"
                      />
                      <StatsCard
                        label="Incasso lordo"
                        value={formatMoneyFromCents(
                          paymentStats.totalCents,
                          "eur",
                        )}
                        note="Somma importi reali"
                        icon="hugeicons:wallet-02"
                      />
                    </div>

                    <section className="mb-6 rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#2c395b]">
                            Prenotazione manuale (bonifico)
                          </p>
                          <p className="text-xs text-[#6d7b80]">
                            Inserisci prenotazioni fuori sito per mantenere
                            disponibilita e contatori reali.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentsManualFormOpen((current) => !current)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#2c395b]/15 bg-white px-4 py-2 text-sm font-semibold text-[#2c395b]"
                        >
                          <Icon
                            icon={
                              paymentsManualFormOpen
                                ? "hugeicons:arrow-up-01"
                                : "hugeicons:arrow-down-01"
                            }
                            width="16"
                            height="16"
                          />
                          {paymentsManualFormOpen ? "Chiudi" : "Aggiungi"}
                        </button>
                      </div>

                      {paymentsManualFormOpen ? (
                        <form
                          className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3"
                          onSubmit={submitPaymentsManualBooking}
                        >
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Evento
                            <select
                              value={paymentsManualForm.eventSlug}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => {
                                  const nextEventSlug = event.target.value;
                                  const nextEvent = manualBookingEventOptions.find(
                                    (item) => item.slug === nextEventSlug,
                                  );
                                  return {
                                    ...current,
                                    eventSlug: nextEventSlug,
                                    eventDateIso: nextEvent?.dates?.[0]?.iso || "",
                                  };
                                })
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                            >
                              <option value="">Seleziona evento</option>
                              {manualBookingEventOptions.map((event) => (
                                <option key={event.slug} value={event.slug}>
                                  {event.title}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Data evento
                            <select
                              value={paymentsManualForm.eventDateIso}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  eventDateIso: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                              disabled={!selectedManualBookingEvent}
                            >
                              <option value="">Seleziona data</option>
                              {(selectedManualBookingEvent?.dates || []).map(
                                (date) => (
                                  <option key={date.iso} value={date.iso}>
                                    {date.labelIt || date.iso}
                                  </option>
                                ),
                              )}
                            </select>
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Persone
                            <input
                              type="number"
                              min="1"
                              max={MAX_EVENT_SPOTS}
                              value={paymentsManualForm.attendeeCount}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  attendeeCount: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                              required
                            />
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Email cliente
                            <input
                              type="email"
                              value={paymentsManualForm.customerEmail}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  customerEmail: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                            />
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Importo
                            <input
                              type="text"
                              inputMode="decimal"
                              value={paymentsManualForm.amountEuro}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  amountEuro: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                              placeholder="45,00"
                            />
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b]">
                            Nota
                            <input
                              type="text"
                              value={paymentsManualForm.note}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  note: event.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                              placeholder="Bonifico"
                            />
                          </label>
                          <label className="text-sm font-semibold text-[#2c395b] lg:col-span-3">
                            Nomi partecipanti
                            <textarea
                              value={paymentsManualForm.attendeeNames}
                              onChange={(event) =>
                                setPaymentsManualForm((current) => ({
                                  ...current,
                                  attendeeNames: event.target.value,
                                }))
                              }
                              className="mt-1 min-h-[72px] w-full rounded-xl border border-[#c9573c]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9573c]"
                            />
                          </label>
                          <div className="lg:col-span-3">
                            <button
                              type="submit"
                              disabled={paymentsLoading}
                              className="rounded-xl bg-[#2c395b] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {paymentsLoading
                                ? "Salvataggio..."
                                : "Salva bonifico"}
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </section>

                    <div className="space-y-4 lg:hidden">
                      {payments.length ? (
                        payments.map((payment) => {
                          const sessionId = String(
                            payment.stripe_session_id || "",
                          );
                          const isExpanded =
                            sessionId && expandedPaymentSessionId === sessionId;

                          return (
                            <PaymentMobileCard
                              key={payment.stripe_session_id}
                              payment={payment}
                              isExpanded={Boolean(isExpanded)}
                              onToggle={() =>
                                setExpandedPaymentSessionId((current) =>
                                  current === sessionId ? "" : sessionId,
                                )
                              }
                              onToggleExcluded={updatePaymentExclusion}
                              isUpdatingExclusion={
                                updatingPaymentExclusionId === sessionId
                              }
                            />
                          );
                        })
                      ) : (
                        <div className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-6 text-center text-sm text-[#6d7b80]">
                          Nessun pagamento registrato ancora.
                        </div>
                      )}
                    </div>

                    <div className="hidden overflow-x-auto rounded-md border border-[#c9573c]/10 lg:block">
                      <table className="min-w-full text-sm">
                        <thead className="bg-[#fff8f4] text-[#2c395b]">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-left">
                              Dettagli
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Data
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Evento
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Importo
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Stato
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Email
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Partecipanti
                            </th>
                            <th className="px-4 py-3 font-semibold text-left">
                              Sessione
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.length ? (
                            payments.map((payment) => {
                              const attendeeNames = getAttendeeNames(payment);
                              const attendeeCount =
                                getBookingAttendeeCount(payment);
                              const sessionId = String(
                                payment.stripe_session_id || "",
                              );
                              const paymentIsTest = isTestBooking(payment);
                              const isExpanded =
                                sessionId &&
                                expandedPaymentSessionId === sessionId;
                              const metadata =
                                payment?.raw_payload?.metadata || {};
                              const customerDetails =
                                payment?.raw_payload?.customer_details || {};
                              const eventDateLabel =
                                getPaymentEventDateLabel(payment);

                              return (
                                <Fragment key={payment.stripe_session_id}>
                                  <tr className="border-t border-[#c9573c]/10 bg-white">
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedPaymentSessionId(
                                            (current) =>
                                              current === sessionId
                                                ? ""
                                                : sessionId,
                                          )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-[#c9573c]/20 px-3 py-1 text-xs font-semibold text-[#2c395b] transition hover:bg-[#fff8f4]"
                                      >
                                        <Icon
                                          icon={
                                            isExpanded
                                              ? "hugeicons:arrow-up-01"
                                              : "hugeicons:arrow-down-01"
                                          }
                                          width="14"
                                          height="14"
                                        />
                                        {isExpanded ? "Chiudi" : "Apri"}
                                      </button>
                                    </td>
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      {formatAdminDateTime(payment.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <p className="font-semibold text-[#2c395b]">
                                        {payment.event_slug || "-"}
                                      </p>
                                      <p className="text-xs text-[#6d7b80]">
                                        {eventDateLabel}
                                      </p>
                                      {payment.event_date_iso &&
                                      eventDateLabel !==
                                        payment.event_date_iso ? (
                                        <p className="font-mono text-[11px] text-[#6d7b80]/75">
                                          {payment.event_date_iso}
                                        </p>
                                      ) : null}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#2c395b]">
                                      {formatMoneyFromCents(
                                        payment.amount_total,
                                        payment.currency,
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                          paymentIsTest
                                            ? "bg-[#f5e4d8] text-[#9c613d]"
                                            : payment.payment_status === "paid"
                                            ? "bg-[#dfe9df] text-[#4b6b4e]"
                                            : "bg-[#f5e4d8] text-[#9c613d]"
                                        }`}
                                      >
                                        {paymentIsTest
                                          ? "test escluso"
                                          : payment.payment_status || "-"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updatePaymentExclusion(
                                            payment,
                                            !paymentIsTest,
                                          )
                                        }
                                        disabled={
                                          updatingPaymentExclusionId ===
                                          sessionId
                                        }
                                        className="mt-2 block rounded-lg border border-[#2c395b]/15 px-2.5 py-1 text-[11px] font-semibold text-[#2c395b] transition hover:bg-[#fff8f4] disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {paymentIsTest
                                          ? "Reincludi"
                                          : "Escludi"}
                                      </button>
                                    </td>
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      {payment.customer_email || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      <p className="font-semibold text-[#2c395b]">
                                        {attendeeCount}{" "}
                                        {attendeeCount === 1
                                          ? "persona"
                                          : "persone"}
                                      </p>
                                      {attendeeNames.length ? (
                                        <p className="text-xs">
                                          {attendeeNames.join(", ")}
                                        </p>
                                      ) : (
                                        <p className="text-xs">
                                          Nomi non inseriti
                                        </p>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-[#6d7b80]">
                                      <span className="font-mono text-xs">
                                        {payment.stripe_session_id || "-"}
                                      </span>
                                    </td>
                                  </tr>
                                  {isExpanded ? (
                                    <tr className="border-t border-[#c9573c]/10 bg-[#fffaf7]">
                                      <td colSpan={8} className="px-4 py-4">
                                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                          <div className="rounded-lg border border-[#c9573c]/15 bg-white p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                                              Dati cliente
                                            </p>
                                            <div className="space-y-1 text-sm text-[#2c395b]">
                                              <p>
                                                <strong>Email:</strong>{" "}
                                                {customerDetails.email ||
                                                  payment.customer_email ||
                                                  "-"}
                                              </p>
                                              <p>
                                                <strong>Nome:</strong>{" "}
                                                {customerDetails.name || "-"}
                                              </p>
                                              <p>
                                                <strong>Telefono:</strong>{" "}
                                                {customerDetails.phone || "-"}
                                              </p>
                                              <p>
                                                <strong>Nazione:</strong>{" "}
                                                {customerDetails.address
                                                  ?.country || "-"}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="rounded-lg border border-[#c9573c]/15 bg-white p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                                              Metadata checkout
                                            </p>
                                            <div className="space-y-1 text-sm text-[#2c395b]">
                                              <p>
                                                <strong>Evento:</strong>{" "}
                                                {metadata.eventSlug || "-"}
                                              </p>
                                              <p>
                                                <strong>Data evento:</strong>{" "}
                                                {eventDateLabel}
                                              </p>
                                              <p>
                                                <strong>ISO data:</strong>{" "}
                                                {metadata.eventDateIso ||
                                                  payment.event_date_iso ||
                                                  "-"}
                                              </p>
                                              <p>
                                                <strong>Partecipanti:</strong>{" "}
                                                {metadata.attendeeCount || "-"}
                                              </p>
                                              <p>
                                                <strong>Nomi:</strong>{" "}
                                                {metadata.attendeeNames || "-"}
                                              </p>
                                              <p>
                                                <strong>Lingua:</strong>{" "}
                                                {metadata.locale || "-"}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="rounded-lg border border-[#c9573c]/15 bg-white p-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#77674E]">
                                              Identificativi Stripe
                                            </p>
                                            <div className="space-y-1 text-sm text-[#2c395b]">
                                              <p>
                                                <strong>Session ID:</strong>{" "}
                                                <span className="font-mono text-xs">
                                                  {payment.stripe_session_id ||
                                                    "-"}
                                                </span>
                                              </p>
                                              <p>
                                                <strong>Payment Intent:</strong>{" "}
                                                <span className="font-mono text-xs">
                                                  {payment.stripe_payment_intent_id ||
                                                    "-"}
                                                </span>
                                              </p>
                                              <p>
                                                <strong>Status:</strong>{" "}
                                                {payment.payment_status || "-"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : null}
                                </Fragment>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan={8}
                                className="px-4 py-8 text-center text-[#6d7b80]"
                              >
                                Nessun pagamento registrato ancora.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
