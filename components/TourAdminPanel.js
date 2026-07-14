import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { uploadEventImage } from "../utils/uploadEventImage";

const DEFAULT_AVAILABILITY_RULES = [
  { startTime: "10:30", endTime: "12:30" },
  { startTime: "14:30", endTime: "16:30" },
];

const emptyTour = {
  slug: "",
  status: "draft",
  featured: false,
  hero_image: "",
  gallery: [],
  title: { it: "", en: "" },
  excerpt: { it: "", en: "" },
  location: { it: "", en: "" },
  duration_minutes: 120,
  price_mode: "per_booking",
  base_price_cents: 18800,
  currency: "eur",
  extension_enabled: true,
  extension_minutes: 30,
  extension_price_cents: 2000,
  meeting_point: { it: "", en: "", link: "" },
  languages: { it: "Italiano", en: "Italian" },
  included: { it: [], en: [] },
  description: { it: [], en: [] },
  availability_rules: DEFAULT_AVAILABILITY_RULES,
  booking_horizon_days: 180,
  minimum_notice_hours: 48,
};

const inputClass =
  "w-full rounded-xl border border-[#c9573c]/15 bg-white px-4 py-3 text-sm text-[#2c395b] outline-none transition focus:border-[#c9573c]";
const labelClass =
  "flex flex-col gap-2 text-sm font-semibold text-[#2c395b]";
const eyebrowClass =
  "text-xs font-semibold uppercase tracking-[0.24em] text-[#c9573c]/70";

function cloneEmptyTour() {
  return JSON.parse(JSON.stringify(emptyTour));
}

function lines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function paragraphs(value) {
  return String(value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function centsToEuro(cents) {
  const amount = Number(cents || 0) / 100;

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toFixed(2);
}

function euroToCents(value) {
  const parsed = Number(String(value || "0").replace(",", "."));

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.round(parsed * 100));
}

function formatMoney(cents, currency = "eur") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: String(currency || "eur").toUpperCase(),
  }).format(Number(cents || 0) / 100);
}

function formatDateTime(value) {
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

function buildSlugFromTitle(title = "") {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getStatusLabel(status) {
  return status === "published" ? "Pubblicato" : "Bozza";
}

function getTourTitle(tour) {
  return tour?.title?.it || tour?.title?.en || tour?.slug || "Tour senza titolo";
}

function getTourPreviewUrl(tour) {
  const slug = String(tour?.slug || "").trim();
  return slug ? `/tour/${encodeURIComponent(slug)}` : "";
}

function toForm(tour = {}) {
  const base = {
    ...cloneEmptyTour(),
    ...tour,
    title: { ...emptyTour.title, ...(tour.title || {}) },
    excerpt: { ...emptyTour.excerpt, ...(tour.excerpt || {}) },
    location: { ...emptyTour.location, ...(tour.location || {}) },
    meeting_point: { ...emptyTour.meeting_point, ...(tour.meeting_point || {}) },
    languages: { ...emptyTour.languages, ...(tour.languages || {}) },
    included: { ...emptyTour.included, ...(tour.included || {}) },
    description: { ...emptyTour.description, ...(tour.description || {}) },
    availability_rules:
      Array.isArray(tour.availability_rules) && tour.availability_rules.length
        ? tour.availability_rules
        : DEFAULT_AVAILABILITY_RULES,
  };

  return {
    ...base,
    galleryText: (base.gallery || []).join("\n"),
    includedIt: (base.included?.it || []).join("\n"),
    includedEn: (base.included?.en || []).join("\n"),
    descriptionIt: (base.description?.it || []).join("\n\n"),
    descriptionEn: (base.description?.en || []).join("\n\n"),
    basePriceEuro: centsToEuro(base.base_price_cents),
    extensionPriceEuro: centsToEuro(base.extension_price_cents),
  };
}

function freshForm() {
  return toForm(cloneEmptyTour());
}

function buildPayload(form, status) {
  return {
    slug: String(form.slug || "").trim(),
    status,
    featured: Boolean(form.featured),
    hero_image: String(form.hero_image || "").trim(),
    gallery: lines(form.galleryText),
    title: {
      it: String(form.title?.it || "").trim(),
      en: String(form.title?.en || "").trim(),
    },
    excerpt: {
      it: String(form.excerpt?.it || "").trim(),
      en: String(form.excerpt?.en || "").trim(),
    },
    location: {
      it: String(form.location?.it || "").trim(),
      en: String(form.location?.en || "").trim(),
    },
    duration_minutes: Number(form.duration_minutes || 120),
    price_mode: form.price_mode === "per_person" ? "per_person" : "per_booking",
    base_price_cents: euroToCents(form.basePriceEuro),
    currency: String(form.currency || "eur").trim().toLowerCase(),
    extension_enabled: Boolean(form.extension_enabled),
    extension_minutes: Number(form.extension_minutes || 30),
    extension_price_cents: euroToCents(form.extensionPriceEuro),
    meeting_point: {
      it: String(form.meeting_point?.it || "").trim(),
      en: String(form.meeting_point?.en || "").trim(),
      link: String(form.meeting_point?.link || "").trim(),
    },
    languages: {
      it: String(form.languages?.it || "").trim(),
      en: String(form.languages?.en || "").trim(),
    },
    included: {
      it: lines(form.includedIt),
      en: lines(form.includedEn),
    },
    description: {
      it: paragraphs(form.descriptionIt),
      en: paragraphs(form.descriptionEn),
    },
    availability_rules: (form.availability_rules || [])
      .map((slot) => ({
        startTime: String(slot.startTime || "").trim(),
        endTime: String(slot.endTime || "").trim(),
      }))
      .filter((slot) => slot.startTime && slot.endTime),
    booking_horizon_days: Number(form.booking_horizon_days || 180),
    minimum_notice_hours: Number(form.minimum_notice_hours || 0),
  };
}

function validateTourForm(form) {
  if (!String(form.slug || "").trim()) {
    return "Lo slug del tour e obbligatorio.";
  }

  if (!String(form.title?.it || "").trim() || !String(form.title?.en || "").trim()) {
    return "Titolo IT e titolo EN sono obbligatori.";
  }

  if (euroToCents(form.basePriceEuro) <= 0) {
    return "Inserisci un prezzo base maggiore di zero.";
  }

  if (!form.availability_rules?.length) {
    return "Inserisci almeno una fascia oraria disponibile.";
  }

  const invalidSlot = form.availability_rules.find(
    (slot) => !slot.startTime || !slot.endTime || slot.startTime >= slot.endTime,
  );

  if (invalidSlot) {
    return "Ogni fascia deve avere un orario di inizio precedente all'orario di fine.";
  }

  return "";
}

function StatCard({ label, value, note, icon }) {
  return (
    <article className="rounded-md border border-[#dfe7e3] bg-white p-5 shadow-[0_18px_42px_rgba(44,57,91,0.06)]">
      <div className="mb-4 flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#fff1ec] text-[#c9573c]">
          <Icon icon={icon} width="21" height="21" />
        </span>
      </div>
      <p className="mb-2 text-sm font-semibold text-[#6d7b80]">{label}</p>
      <p className="mb-1 text-3xl font-bold text-[#2c395b]">{value}</p>
      <p className="text-sm text-[#6d7b80]">{note}</p>
    </article>
  );
}

function Field({ label, children, className = "", hint = "" }) {
  return (
    <label className={`${labelClass} ${className}`}>
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-[#6d7b80]">{hint}</span> : null}
    </label>
  );
}

export default function TourAdminPanel({ adminKey }) {
  const [tours, setTours] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState(freshForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [google, setGoogle] = useState({ connected: false });
  const [googleCalendars, setGoogleCalendars] = useState([]);
  const [selectedGoogleCalendars, setSelectedGoogleCalendars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [block, setBlock] = useState({
    title: "Non disponibile",
    date: "",
    startTime: "10:30",
    endTime: "12:30",
  });

  const selectedTour = useMemo(
    () => tours.find((tour) => tour.slug === selectedSlug) || null,
    [selectedSlug, tours],
  );

  const stats = useMemo(() => {
    const published = tours.filter((tour) => tour.status === "published").length;
    const drafts = tours.filter((tour) => tour.status === "draft").length;
    const paidBookings = bookings.filter(
      (booking) => booking.payment_status === "paid",
    ).length;

    return { published, drafts, paidBookings };
  }, [bookings, tours]);

  const request = useCallback(
    async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${adminKey}`,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
        },
      });
      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (_error) {
          throw new Error("Risposta admin non valida. Ricarica la dashboard e riprova.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Operazione non riuscita.");
      }

      return data;
    },
    [adminKey],
  );

  const load = useCallback(async () => {
    if (!adminKey) {
      return;
    }

    setError("");

    try {
      const [tourData, googleData, bookingData] = await Promise.all([
        request("/api/admin/tours"),
        request("/api/admin/google-calendar"),
        request("/api/admin/tours?action=bookings"),
      ]);

      setTours(tourData.tours || []);
      setGoogle(googleData);
      setBookings(bookingData.bookings || []);

      if (googleData.connected) {
        try {
          const calendarData = await request(
            "/api/admin/google-calendar?action=calendars",
          );
          setGoogleCalendars(calendarData.calendars || []);
          setSelectedGoogleCalendars(calendarData.selectedCalendarIds || []);
        } catch (_calendarError) {
          setGoogleCalendars([]);
          setError(
            "Ricollega Google Calendar per autorizzare la lettura delle disponibilita.",
          );
        }
      } else {
        setGoogleCalendars([]);
        setSelectedGoogleCalendars([]);
      }
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [adminKey, request]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateNested(group, key, value) {
    setForm((current) => ({
      ...current,
      [group]: { ...(current[group] || {}), [key]: value },
    }));
  }

  function updateAvailabilitySlot(index, field, value) {
    setForm((current) => ({
      ...current,
      availability_rules: current.availability_rules.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  }

  function addAvailabilitySlot() {
    setForm((current) => ({
      ...current,
      availability_rules: [
        ...(current.availability_rules || []),
        { startTime: "10:30", endTime: "12:30" },
      ],
    }));
  }

  function removeAvailabilitySlot(index) {
    setForm((current) => {
      const nextRules = current.availability_rules.filter(
        (_slot, slotIndex) => slotIndex !== index,
      );

      return {
        ...current,
        availability_rules: nextRules.length ? nextRules : DEFAULT_AVAILABILITY_RULES,
      };
    });
  }

  function chooseTour(tour) {
    setSelectedSlug(tour.slug);
    setForm(toForm(tour));
    setMessage("");
    setError("");
  }

  function createNew() {
    setSelectedSlug("");
    setForm(freshForm());
    setMessage("");
    setError("");
  }

  async function save(status) {
    const validationError = validateTourForm(form);

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await request(
        selectedSlug
          ? `/api/admin/tours?slug=${encodeURIComponent(selectedSlug)}`
          : "/api/admin/tours",
        {
          method: selectedSlug ? "PUT" : "POST",
          body: JSON.stringify(buildPayload(form, status)),
        },
      );

      setSelectedSlug(data.tour.slug);
      setForm(toForm(data.tour));
      setMessage(status === "published" ? "Tour pubblicato." : "Bozza salvata.");
      await load();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!selectedSlug) {
      return;
    }

    const confirmed =
      typeof window !== "undefined" &&
      window.confirm("Vuoi eliminare questo tour?");

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request(`/api/admin/tours?slug=${encodeURIComponent(selectedSlug)}`, {
        method: "DELETE",
      });
      createNew();
      await load();
      setMessage("Tour eliminato.");
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setBusy(false);
    }
  }

  async function upload(file) {
    if (!file) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const url = await uploadEventImage(file, adminKey);
      updateField("hero_image", url);
      setMessage("Immagine caricata. Salva il tour per confermare.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  }

  async function googleAction(action) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (action === "authorize") {
        const data = await request("/api/admin/google-calendar?action=authorize");
        window.location.href = data.url;
        return;
      }

      const data = await request(`/api/admin/google-calendar?action=${action}`, {
        method: "POST",
      });

      setMessage(
        action === "sync"
          ? `Sincronizzazione completata: ${data.imported || 0} fasce occupate.`
          : "Canale Google Calendar rinnovato.",
      );
      await load();
    } catch (googleError) {
      setError(googleError.message);
    } finally {
      setBusy(false);
    }
  }

  function toggleGoogleCalendar(calendarId) {
    setSelectedGoogleCalendars((current) =>
      current.includes(calendarId)
        ? current.filter((id) => id !== calendarId)
        : [...current, calendarId],
    );
  }

  async function saveGoogleCalendarSelection() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request("/api/admin/google-calendar?action=calendars", {
        method: "PUT",
        body: JSON.stringify({ calendarIds: selectedGoogleCalendars }),
      });
      setMessage("Calendari salvati. Ora puoi sincronizzare le disponibilita.");
      await load();
    } catch (selectionError) {
      setError(selectionError.message);
    } finally {
      setBusy(false);
    }
  }

  async function addBlock() {
    if (!block.date) {
      setError("Seleziona la data da bloccare.");
      setMessage("");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request("/api/admin/calendar", {
        method: "POST",
        body: JSON.stringify({
          title: block.title,
          date: block.date,
          startTime: block.startTime,
          endTime: block.endTime,
          tour_slug: selectedSlug || null,
        }),
      });
      setMessage("Fascia bloccata nel calendario.");
    } catch (blockError) {
      setError(blockError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className={eyebrowClass}>Catalogo tour</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2c395b]">
            Tour canonici
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d7b80]">
            Gestisci contenuti, prezzi, fasce disponibili, blocchi manuali e
            sincronizzazione Google Calendar dei tour fissi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={createNew}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c9573c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b74d33]"
          >
            <Icon icon="hugeicons:add-circle" width="18" height="18" />
            Nuovo tour
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-md border border-[#c9573c]/20 bg-[#fff1ec] px-5 py-4 text-sm font-medium text-[#b74d33]">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-md border border-[#4b6b4e]/20 bg-[#edf7ee] px-5 py-4 text-sm font-medium text-[#4b6b4e]">
          {message}
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Tour pubblicati"
          value={stats.published}
          note={`${stats.drafts} bozze salvate`}
          icon="hugeicons:maps-location-01"
        />
        <StatCard
          label="Prenotazioni pagate"
          value={stats.paidBookings}
          note="Dati da Stripe webhook"
          icon="hugeicons:credit-card"
        />
        <StatCard
          label="Google Calendar"
          value={google.connected ? "Collegato" : "Non collegato"}
          note={
            google.connected
              ? `${selectedGoogleCalendars.length || 1} calendari selezionati`
              : "Sincronizzazione non attiva"
          }
          icon="hugeicons:calendar-03"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm">
          <div className="mb-5">
            <p className={eyebrowClass}>Archivio</p>
            <h2 className="mt-2 text-2xl font-bold text-[#2c395b]">
              Tour salvati
            </h2>
          </div>

          <div className="space-y-3">
            {tours.length ? (
              tours.map((tour) => (
                <div
                  key={tour.slug}
                  className={`w-full rounded-md border p-4 text-left transition ${
                    selectedSlug === tour.slug
                      ? "border-[#c9573c]/35 bg-[#fff1ec]"
                      : "border-[#c9573c]/10 bg-[#fffaf7] hover:border-[#c9573c]/25"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        tour.status === "published"
                          ? "bg-[#dfe9df] text-[#4b6b4e]"
                          : "bg-[#f5e4d8] text-[#9c613d]"
                      }`}
                    >
                      {getStatusLabel(tour.status)}
                    </span>
                    {tour.featured ? (
                      <span className="rounded-full bg-[#CE9486]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9573c]">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <strong className="block text-base text-[#2c395b]">
                    {getTourTitle(tour)}
                  </strong>
                  <span className="mt-2 block text-xs text-[#6d7b80]">
                    {tour.location?.it || "-"} ·{" "}
                    {formatMoney(tour.base_price_cents, tour.currency)}
                  </span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => chooseTour(tour)}
                      className="rounded-xl border border-[#c9573c]/20 bg-white px-3 py-2 text-xs font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
                    >
                      Modifica
                    </button>
                    {getTourPreviewUrl(tour) ? (
                      <a
                        href={getTourPreviewUrl(tour)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-[#77674E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#685b43]"
                      >
                        Apri
                      </a>
                    ) : null}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-5 text-sm leading-6 text-[#6d7b80]">
                Nessun tour nel database. Puoi importare quelli attuali o
                crearne uno nuovo.
              </p>
            )}
          </div>
        </aside>

        <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className={eyebrowClass}>Editor tour</p>
              <h2 className="mt-2 text-3xl font-bold text-[#2c395b]">
                {selectedTour ? "Modifica tour" : "Crea nuovo tour"}
              </h2>
              <p className="mt-2 text-sm text-[#6d7b80]">
                I tour canonici usano disponibilita ricorrenti e calendario
                operativo, non date evento fisse.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  updateField("slug", form.slug || buildSlugFromTitle(form.title?.it))
                }
                className="rounded-xl border border-[#c9573c]/20 px-4 py-2 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10"
              >
                Genera slug
              </button>
              {selectedSlug ? (
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy}
                  className="rounded-xl border border-[#b74d33]/20 px-4 py-2 text-sm font-semibold text-[#b74d33] transition hover:bg-[#fff1ec] disabled:opacity-50"
                >
                  Elimina tour
                </button>
              ) : null}
            </div>
          </div>

          <form
            className="grid grid-cols-1 gap-5 xl:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <Field label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className={inputClass}
                placeholder="es. siena"
              />
            </Field>

            <Field label="Stato">
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className={inputClass}
              >
                <option value="draft">Bozza</option>
                <option value="published">Pubblicato</option>
              </select>
            </Field>

            <Field label="Titolo IT">
              <input
                type="text"
                value={form.title?.it || ""}
                onChange={(event) => updateNested("title", "it", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Titolo EN">
              <input
                type="text"
                value={form.title?.en || ""}
                onChange={(event) => updateNested("title", "en", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Destinazione IT">
              <input
                type="text"
                value={form.location?.it || ""}
                onChange={(event) =>
                  updateNested("location", "it", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Destinazione EN">
              <input
                type="text"
                value={form.location?.en || ""}
                onChange={(event) =>
                  updateNested("location", "en", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Estratto IT" className="xl:col-span-2">
              <textarea
                rows="3"
                value={form.excerpt?.it || ""}
                onChange={(event) => updateNested("excerpt", "it", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Estratto EN" className="xl:col-span-2">
              <textarea
                rows="3"
                value={form.excerpt?.en || ""}
                onChange={(event) => updateNested("excerpt", "en", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Hero image URL">
              <input
                type="text"
                value={form.hero_image || ""}
                onChange={(event) => updateField("hero_image", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Carica immagine" hint="Usa lo stesso upload degli eventi.">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => upload(event.target.files?.[0])}
                className={inputClass}
              />
            </Field>

            <Field label="Galleria, un URL per riga" className="xl:col-span-2">
              <textarea
                rows="4"
                value={form.galleryText || ""}
                onChange={(event) => updateField("galleryText", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Descrizione IT" className="xl:col-span-2">
              <textarea
                rows="7"
                value={form.descriptionIt || ""}
                onChange={(event) =>
                  updateField("descriptionIt", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Descrizione EN" className="xl:col-span-2">
              <textarea
                rows="7"
                value={form.descriptionEn || ""}
                onChange={(event) =>
                  updateField("descriptionEn", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Incluso IT">
              <textarea
                rows="4"
                value={form.includedIt || ""}
                onChange={(event) => updateField("includedIt", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Incluso EN">
              <textarea
                rows="4"
                value={form.includedEn || ""}
                onChange={(event) => updateField("includedEn", event.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-5 xl:col-span-2">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className={eyebrowClass}>Prezzo e checkout</p>
                  <h3 className="mt-2 text-xl font-bold text-[#2c395b]">
                    Regole di vendita
                  </h3>
                </div>
                <label className="inline-flex items-center gap-2 rounded-xl border border-[#c9573c]/15 bg-white px-4 py-3 text-sm font-semibold text-[#2c395b]">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateField("featured", event.target.checked)}
                    className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                  />
                  Featured
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Prezzo base EUR">
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={form.basePriceEuro}
                    onChange={(event) =>
                      updateField("basePriceEuro", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Tipo tariffa">
                  <select
                    value={form.price_mode}
                    onChange={(event) => updateField("price_mode", event.target.value)}
                    className={inputClass}
                  >
                    <option value="per_booking">Complessiva</option>
                    <option value="per_person">Per persona</option>
                  </select>
                </Field>
                <Field label="Durata minuti">
                  <input
                    type="number"
                    min="1"
                    value={form.duration_minutes}
                    onChange={(event) =>
                      updateField("duration_minutes", Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Preavviso ore">
                  <input
                    type="number"
                    min="0"
                    value={form.minimum_notice_hours}
                    onChange={(event) =>
                      updateField("minimum_notice_hours", Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Supplemento EUR">
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={form.extensionPriceEuro}
                    onChange={(event) =>
                      updateField("extensionPriceEuro", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Minuti supplemento">
                  <input
                    type="number"
                    min="1"
                    value={form.extension_minutes}
                    onChange={(event) =>
                      updateField("extension_minutes", Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Orizzonte giorni">
                  <input
                    type="number"
                    min="1"
                    value={form.booking_horizon_days}
                    onChange={(event) =>
                      updateField("booking_horizon_days", Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-center gap-2 rounded-xl border border-[#c9573c]/10 bg-white px-4 py-3 text-sm font-semibold text-[#2c395b]">
                  <input
                    type="checkbox"
                    checked={form.extension_enabled}
                    onChange={(event) =>
                      updateField("extension_enabled", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                  />
                  Supplemento attivo
                </label>
              </div>
            </div>

            <div className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-5 xl:col-span-2">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className={eyebrowClass}>Disponibilita ricorrenti</p>
                  <h3 className="mt-2 text-xl font-bold text-[#2c395b]">
                    Fasce orarie vendibili
                  </h3>
                  <p className="mt-1 text-sm text-[#6d7b80]">
                    Il sito mostra queste fasce solo quando Google Calendar e i
                    blocchi manuali non occupano lo stesso intervallo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addAvailabilitySlot}
                  className="rounded-xl border border-[#c9573c]/20 bg-white px-4 py-2 text-sm font-semibold text-[#c9573c]"
                >
                  Aggiungi fascia
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(form.availability_rules || []).map((slot, index) => (
                  <div
                    key={`${slot.startTime}-${slot.endTime}-${index}`}
                    className="rounded-md border border-[#c9573c]/10 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#2c395b]">
                        Fascia #{index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeAvailabilitySlot(index)}
                        className="text-xs font-semibold text-[#b74d33] underline underline-offset-4"
                      >
                        Rimuovi
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Inizio">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(event) =>
                            updateAvailabilitySlot(
                              index,
                              "startTime",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Fine">
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(event) =>
                            updateAvailabilitySlot(
                              index,
                              "endTime",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end xl:col-span-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => save("draft")}
                className="rounded-xl border border-[#c9573c]/20 px-5 py-3 text-sm font-semibold text-[#c9573c] transition hover:bg-[#CE9486]/10 disabled:opacity-50"
              >
                Salva bozza
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => save("published")}
                className="rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43] disabled:opacity-50"
              >
                Pubblica tour
              </button>
            </div>
          </form>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-4 rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm">
          <div>
            <p className={eyebrowClass}>Disponibilita esterne</p>
            <h2 className="mt-2 text-2xl font-bold text-[#2c395b]">
              Google Calendar
            </h2>
            <p className="mt-2 text-sm text-[#6d7b80]">
              {google.connected
                ? `Collegato${
                    google.connection?.channel_expiration
                      ? ` · webhook fino al ${formatDateTime(
                          google.connection.channel_expiration,
                        )}`
                      : ""
                  }`
                : "Non collegato"}
            </p>
          </div>

          {google.connected && googleCalendars.length ? (
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-semibold text-[#2c395b]">
                Calendari che bloccano le disponibilita
              </legend>
              {googleCalendars.map((calendar) => (
                <label
                  key={calendar.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md bg-[#fffaf7] p-3 text-sm text-[#2c395b]"
                >
                  <input
                    type="checkbox"
                    checked={selectedGoogleCalendars.includes(calendar.id)}
                    onChange={() => toggleGoogleCalendar(calendar.id)}
                    className="h-4 w-4 rounded border-[#c9573c]/40 text-[#c9573c] focus:ring-[#c9573c]"
                  />
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: calendar.backgroundColor || "#526d91" }}
                  />
                  <span className="font-semibold">{calendar.summary}</span>
                  {calendar.primary ? (
                    <span className="ml-auto text-xs text-[#6d7b80]">
                      Principale
                    </span>
                  ) : null}
                </label>
              ))}
            </fieldset>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {!google.connected ? (
              <button
                type="button"
                onClick={() => googleAction("authorize")}
                className="rounded-xl bg-[#2c395b] px-4 py-3 text-sm font-semibold text-white"
              >
                Collega Google
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => googleAction("authorize")}
                  className="rounded-xl border border-[#2c395b]/20 px-4 py-3 text-sm font-semibold text-[#2c395b]"
                >
                  Ricollega Google
                </button>
                {googleCalendars.length ? (
                  <button
                    type="button"
                    disabled={busy || !selectedGoogleCalendars.length}
                    onClick={saveGoogleCalendarSelection}
                    className="rounded-xl bg-[#77674e] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Salva calendari
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => googleAction("sync")}
                  className="rounded-xl bg-[#2c395b] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Sincronizza ora
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => googleAction("watch")}
                  className="rounded-xl border border-[#2c395b]/20 px-4 py-3 text-sm font-semibold text-[#2c395b] disabled:opacity-50"
                >
                  Rinnova webhook
                </button>
              </>
            )}
          </div>

          <p className="rounded-md bg-[#fffaf7] p-4 text-xs leading-6 text-[#6d7b80]">
            Il sito riceve soltanto gli intervalli occupati tramite Free/Busy:
            non importa titoli o dettagli degli appuntamenti Google.
          </p>
        </article>

        <article className="space-y-4 rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm">
          <div>
            <p className={eyebrowClass}>Agenda operativa</p>
            <h2 className="mt-2 text-2xl font-bold text-[#2c395b]">
              Blocca una fascia
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d7b80]">
              Usa questo blocco quando la cliente non e disponibile, anche se
              non esiste un evento pubblico da mostrare.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Titolo blocco" className="sm:col-span-2">
              <input
                type="text"
                className={inputClass}
                value={block.title}
                onChange={(event) =>
                  setBlock((current) => ({ ...current, title: event.target.value }))
                }
              />
            </Field>
            <Field label="Data">
              <input
                type="date"
                className={inputClass}
                value={block.date}
                onChange={(event) =>
                  setBlock((current) => ({ ...current, date: event.target.value }))
                }
              />
            </Field>
            <Field label="Tour collegato">
              <input
                type="text"
                className={`${inputClass} bg-[#f8f4ef]`}
                value={selectedTour ? getTourTitle(selectedTour) : "Nessun tour selezionato"}
                readOnly
              />
            </Field>
            <Field label="Inizio">
              <input
                type="time"
                className={inputClass}
                value={block.startTime}
                onChange={(event) =>
                  setBlock((current) => ({
                    ...current,
                    startTime: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Fine">
              <input
                type="time"
                className={inputClass}
                value={block.endTime}
                onChange={(event) =>
                  setBlock((current) => ({ ...current, endTime: event.target.value }))
                }
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={addBlock}
            disabled={busy}
            className="rounded-xl bg-[#77674e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43] disabled:opacity-50"
          >
            Blocca nel calendario
          </button>
        </article>
      </section>

      <article className="rounded-md border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={eyebrowClass}>Checkout tour</p>
            <h2 className="mt-2 text-2xl font-bold text-[#2c395b]">
              Prenotazioni tour
            </h2>
          </div>
          <span className="text-sm font-semibold text-[#77674E]">
            {bookings.length} prenotazioni registrate
          </span>
        </div>

        {bookings.length ? (
          <>
            <div className="grid gap-3 lg:hidden">
              {bookings.slice(0, 20).map((booking) => (
                <div
                  key={booking.id || booking.stripe_session_id}
                  className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-4"
                >
                  <p className="font-semibold text-[#2c395b]">
                    {booking.tour_slug || "-"}
                  </p>
                  <p className="mt-1 text-sm text-[#6d7b80]">
                    {formatDateTime(booking.starts_at)} ·{" "}
                    {formatMoney(booking.amount_total, booking.currency)}
                  </p>
                  <p className="mt-1 text-xs text-[#6d7b80]">
                    {booking.customer_email || "-"} · {booking.payment_status}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-md border border-[#c9573c]/10 lg:block">
              <table className="min-w-full text-sm">
                <thead className="bg-[#fff8f4] text-[#2c395b]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Tour</th>
                    <th className="px-4 py-3 text-left font-semibold">Data</th>
                    <th className="px-4 py-3 text-left font-semibold">Importo</th>
                    <th className="px-4 py-3 text-left font-semibold">Stato</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Persone</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 50).map((booking) => (
                    <tr
                      key={booking.id || booking.stripe_session_id}
                      className="border-t border-[#c9573c]/10 bg-white"
                    >
                      <td className="px-4 py-3 font-semibold text-[#2c395b]">
                        {booking.tour_slug || "-"}
                      </td>
                      <td className="px-4 py-3 text-[#6d7b80]">
                        {formatDateTime(booking.starts_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#2c395b]">
                        {formatMoney(booking.amount_total, booking.currency)}
                      </td>
                      <td className="px-4 py-3 text-[#6d7b80]">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            booking.payment_status === "paid"
                              ? "bg-[#dfe9df] text-[#4b6b4e]"
                              : "bg-[#f5e4d8] text-[#9c613d]"
                          }`}
                        >
                          {booking.payment_status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6d7b80]">
                        {booking.customer_email || "-"}
                      </td>
                      <td className="px-4 py-3 text-[#6d7b80]">
                        {booking.attendee_count || 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="rounded-md border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-6 text-sm leading-6 text-[#6d7b80]">
            Nessuna prenotazione tour registrata ancora.
          </p>
        )}
      </article>
    </div>
  );
}
