import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

const DEFAULT_TIMEZONE = "Europe/Rome";
const NAV_ITEMS = [
  { id: "overview", label: "Panoramica", icon: "hugeicons:square-lock-02" },
  { id: "events", label: "Eventi", icon: "hugeicons:calendar-03" },
  { id: "editor", label: "Editor", icon: "hugeicons:note-edit" },
  { id: "sync", label: "Google Sync", icon: "hugeicons:link-circle-02" },
];

function createDateEntry(partial = {}) {
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
    googleCalendar: partial.googleCalendar || null,
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
      timeZone: DEFAULT_TIMEZONE,
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
              googleCalendar: date.googleCalendar || null,
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
    spots: Number(String(date.spots || "").trim()) || 0,
    googleCalendar: date.googleCalendar || undefined,
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

function getSyncedDatesCount(event) {
  return (event?.dates || []).filter((date) => date.googleCalendar?.eventId)
    .length;
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
      !date.labelIt.trim() ||
      !date.labelEn.trim(),
  );

  if (invalidDate) {
    return "Ogni data deve avere giorno, orario, posti e label IT/EN.";
  }

  return "";
}

function StatsCard({ label, value, note, icon }) {
  return (
    <article className="rounded-[1.6rem] border border-[#c9573c]/10 bg-white/80 p-5 shadow-[0_16px_40px_rgba(35,47,55,0.05)] backdrop-blur-sm">
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

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("overview");
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState(() => buildEmptyForm());
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [syncStatus, setSyncStatus] = useState(null);

  const selectedEvent =
    events.find((event) => event.slug === selectedSlug) || null;
  const selectedEventSyncedDates = getSyncedDatesCount(selectedEvent);

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
      {
        label: "Google Sync",
        value: syncStatus?.configured
          ? `${syncStatus.syncedDates}/${syncStatus.publishedDates}`
          : "Setup",
        note: syncStatus?.configured
          ? `${syncStatus.calendarId || "Calendar pronto"}`
          : "Manca ancora la configurazione OAuth",
        icon: "hugeicons:link-circle-02",
      },
    ];
  }, [events, syncStatus]);

  useEffect(() => {
    const storedKey =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("lou-admin-key") || ""
        : "";

    if (storedKey) {
      setAdminKey(storedKey);
      setKeyInput(storedKey);
    }

    setBooting(false);
  }, []);

  const loadSyncStatus = useCallback(
    async (key = adminKey) => {
      if (!key) {
        return;
      }

      try {
        const response = await fetch("/api/admin/google-calendar/status", {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Errore nel caricamento stato Google.");
        }

        setSyncStatus(data.status || null);
      } catch (fetchError) {
        setError(fetchError.message);
      }
    },
    [adminKey],
  );

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
    [activePanel, adminKey, selectedSlug],
  );

  useEffect(() => {
    if (!adminKey) {
      return;
    }

    loadEvents(adminKey);
    loadSyncStatus(adminKey);
  }, [adminKey, loadEvents, loadSyncStatus]);

  function handleLogin(event) {
    event.preventDefault();
    setNotice("");
    setError("");
    setAdminKey(keyInput.trim());

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("lou-admin-key", keyInput.trim());
    }
  }

  function handleLogout() {
    setAdminKey("");
    setKeyInput("");
    setEvents([]);
    setSelectedSlug("");
    setForm(buildEmptyForm());
    setNotice("");
    setError("");
    setSyncStatus(null);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("lou-admin-key");
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
    setForm((current) => ({
      ...current,
      dates: [...current.dates, createDateEntry()],
    }));
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

  async function postAdminJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Operazione non riuscita.");
    }

    return data;
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
        throw new Error(data.error || "Salvataggio non riuscito.");
      }

      setNotice(
        nextStatus === "published"
          ? "Evento salvato e pubblicato."
          : "Bozza salvata correttamente.",
      );

      await loadEvents(adminKey);
      await loadSyncStatus(adminKey);
      setSelectedSlug(data.event.slug);
      setForm(eventToForm(data.event));
      setActivePanel("events");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncSelected() {
    if (!selectedSlug) {
      setError("Seleziona un evento prima di sincronizzare.");
      return;
    }

    setSyncLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await postAdminJson("/api/admin/google-calendar/sync", {
        slug: selectedSlug,
      });
      setNotice(
        `Google Calendar aggiornato per ${data.result.slug}: ${data.result.syncedDates} date sincronizzate.`,
      );
      await loadEvents(adminKey);
      await loadSyncStatus(adminKey);
    } catch (syncError) {
      setError(syncError.message);
    } finally {
      setSyncLoading(false);
    }
  }

  async function handleSyncAll() {
    setSyncLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await postAdminJson("/api/admin/google-calendar/sync", {});
      setNotice(
        `Google Calendar aggiornato: ${data.result.syncedEvents} eventi e ${data.result.syncedDates} date sincronizzate.`,
      );
      await loadEvents(adminKey);
      await loadSyncStatus(adminKey);
    } catch (syncError) {
      setError(syncError.message);
    } finally {
      setSyncLoading(false);
    }
  }

  async function handleUnsyncSelected() {
    if (!selectedSlug) {
      setError("Seleziona un evento prima di rimuoverlo da Google Calendar.");
      return;
    }

    setSyncLoading(true);
    setError("");
    setNotice("");

    try {
      const data = await postAdminJson("/api/admin/google-calendar/unsync", {
        slug: selectedSlug,
      });

      if (data.result.skippedRemoteDelete) {
        setNotice(
          "Metadati Google rimossi localmente. Mancava la configurazione per cancellare anche il calendario remoto.",
        );
      } else {
        setNotice(
          `Eventi Google rimossi per ${data.result.slug}: ${data.result.removedDates} date scollegate.`,
        );
      }

      await loadEvents(adminKey);
      await loadSyncStatus(adminKey);
    } catch (syncError) {
      setError(syncError.message);
    } finally {
      setSyncLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedSlug) {
      return;
    }

    const warningMessage =
      selectedEventSyncedDates > 0
        ? `Questo evento ha ${selectedEventSyncedDates} date sincronizzate con Google Calendar. Le scollego prima di eliminarlo. Vuoi continuare?`
        : "Vuoi eliminare questo evento?";

    const confirmed =
      typeof window === "undefined" ? false : window.confirm(warningMessage);

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (selectedEventSyncedDates > 0) {
        await postAdminJson("/api/admin/google-calendar/unsync", {
          slug: selectedSlug,
        });
      }

      const response = await fetch(`/api/admin/events/${selectedSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminKey}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eliminazione non riuscita.");
      }

      setNotice("Evento eliminato.");
      setSelectedSlug("");
      setForm(buildEmptyForm());
      await loadEvents(adminKey);
      await loadSyncStatus(adminKey);
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
          <title>Lou On Tour | Admin Access</title>
        </Head>
        <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fef3ea_0%,#fff8f4_52%,#f6eee8_100%)] px-4 py-10">
          <section className="w-full max-w-xl rounded-[2rem] border border-[#c9573c]/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(35,47,55,0.08)] backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
              Lou On Tour
            </p>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-[#2c395b]">
              Accesso admin
            </h1>
            <p className="mb-6 text-base leading-7 text-[#6d7b80]">
              Per ora usiamo una chiave admin semplice per collegare dashboard e
              backend. Nel prossimo step la sostituiamo con login reale.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Admin key">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(event) => setKeyInput(event.target.value)}
                  placeholder="Inserisci la chiave admin"
                  className={baseInputClass()}
                />
              </Field>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43]"
              >
                <Icon icon="hugeicons:square-lock-02" width="18" height="18" />
                Entra nella dashboard
              </button>
            </form>

            <div className="mt-6 rounded-[1.5rem] bg-[#fff8f4] p-4 text-sm leading-6 text-[#6d7b80]">
              In locale la chiave di default e{" "}
              <code className="rounded bg-white px-2 py-1 text-[#2c395b]">
                lou-demo-2026
              </code>
              . In produzione useremo <code>ADMIN_API_KEY</code> o auth vera.
            </div>
          </section>
        </main>
      </>
    );
  }

  const showOverview = activePanel === "overview";
  const showEvents = activePanel === "events" || showOverview;
  const showEditor = activePanel === "editor" || showOverview;
  const showSync = activePanel === "sync" || showOverview;

  return (
    <>
      <Head>
        <title>Lou On Tour | Admin Dashboard</title>
        <meta
          name="description"
          content="Dashboard admin per la gestione di eventi, date e pubblicazione."
        />
      </Head>

      <div className="min-h-screen bg-[linear-gradient(180deg,#fef3ea_0%,#fff8f4_52%,#f6eee8_100%)] text-[#232f37]">
        <div className="grid min-h-screen w-full grid-cols-1 xl:grid-cols-[320px_1fr]">
          <aside className="border-b border-[#c9573c]/10 bg-[#fef3ea]/85 px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8 xl:min-h-screen xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between xl:block">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
                  Lou On Tour
                </p>
                <h1 className="text-3xl font-bold leading-tight text-[#2c395b] sm:text-4xl">
                  Admin
                  <br />
                  Dashboard
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[#77674E] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fef3ea]">
                  Solo admin
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-[#c9573c]/20 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]"
                >
                  <Icon icon="hugeicons:logout-03" width="14" height="14" />
                  Esci
                </button>
              </div>
            </div>

            <nav className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePanel(item.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    activePanel === item.id
                      ? "bg-[#77674E] text-white shadow-[0_18px_30px_rgba(119,103,78,0.18)]"
                      : "bg-white/75 text-[#2c395b] hover:bg-[#CE9486]/10"
                  }`}
                >
                  <Icon icon={item.icon} width="20" height="20" />
                  <span className="text-sm font-semibold tracking-wide">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-[1.75rem] bg-[#2c395b] p-5 text-[#fef3ea]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#fef3ea]/70">
                Step utile adesso
              </p>
              <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
                Eventi da admin e sync Google guidata.
              </h2>
              <p className="text-sm leading-6 text-[#fef3ea]/78">
                Gli eventi si gestiscono gia da qui. La sezione Google ti dice
                se l&apos;OAuth e pronto e sincronizza gli eventi pubblicati.
              </p>
            </div>
          </aside>

          <section className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-8">
            <header className="mb-8 rounded-[2rem] border border-[#c9573c]/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(35,47,55,0.06)] backdrop-blur-sm lg:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-4xl">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9573c]/70">
                    Backend eventi attivo
                  </p>
                  <h2 className="mb-3 text-3xl font-bold leading-tight text-[#2c395b] sm:text-4xl xl:text-5xl">
                    Aggiungi, modifica, pubblica e sincronizza da un solo posto.
                  </h2>
                  <p className="text-base leading-7 text-[#6d7b80] lg:text-lg">
                    L&apos;editor ora usa campi veri per le date, mentre Google
                    Calendar ha una sezione dedicata con stato di configurazione
                    e sync manuale degli eventi pubblicati.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row xl:flex-col xl:min-w-[220px]">
                  <button
                    type="button"
                    onClick={startNewEvent}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#77674E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#685b43]"
                  >
                    <Icon icon="hugeicons:add-circle" width="18" height="18" />
                    Nuovo evento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loadEvents(adminKey);
                      loadSyncStatus(adminKey);
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
              <div className="mb-6 rounded-[1.5rem] border border-[#c9573c]/20 bg-[#fff1ec] px-5 py-4 text-sm font-medium text-[#b74d33]">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="mb-6 rounded-[1.5rem] border border-[#4b6b4e]/20 bg-[#edf7ee] px-5 py-4 text-sm font-medium text-[#4b6b4e]">
                {notice}
              </div>
            ) : null}

            <section className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 2xl:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </section>

            <div className="space-y-6">
              {showEvents ? (
                <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
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
                          event.status === "published" ? "Pubblicato" : "Bozza";
                        const syncedDates = getSyncedDatesCount(event);

                        return (
                          <div
                            key={event.slug}
                            className="grid gap-4 rounded-[1.5rem] border border-[#c9573c]/10 bg-[#fff8f4] p-5 lg:grid-cols-[1fr_auto]"
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
                                {syncedDates ? (
                                  <span className="rounded-full bg-[#edf7ee] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4b6b4e]">
                                    Google {syncedDates}/
                                    {event.dates?.length || 0}
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
                      <div className="rounded-[1.5rem] border border-dashed border-[#c9573c]/20 bg-[#fffaf7] p-6 text-sm leading-7 text-[#6d7b80]">
                        Nessun evento salvato ancora. Crea il primo da qui sopra
                        con “Nuovo evento”.
                      </div>
                    )}
                  </div>
                </article>
              ) : null}

              {showEditor ? (
                <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(35,47,55,0.05)] backdrop-blur-sm lg:p-7">
                  <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                        Editor evento
                      </p>
                      <h3 className="text-3xl font-bold text-[#2c395b]">
                        {selectedSlug ? "Modifica evento" : "Crea nuovo evento"}
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
                        type="text"
                        value={form.heroImage}
                        onChange={(event) =>
                          updateFormField("heroImage", event.target.value)
                        }
                        placeholder="/assets/fotoinsta2.jpg"
                        className={baseInputClass()}
                      />
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
                          updateFormField("meetingPointIt", event.target.value)
                        }
                        className={baseInputClass()}
                      />
                    </Field>

                    <Field label="Punto di ritrovo EN">
                      <input
                        type="text"
                        value={form.meetingPointEn}
                        onChange={(event) =>
                          updateFormField("meetingPointEn", event.target.value)
                        }
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
                            Inserisci giorno, fascia oraria, label e posti senza
                            scrivere stringhe manuali.
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
                            className="rounded-[1.5rem] border border-[#c9573c]/10 bg-[#fffaf7] p-4"
                          >
                            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-[#2c395b]">
                                  Data #{index + 1}
                                </p>
                                <p className="text-xs uppercase tracking-[0.22em] text-[#c9573c]/70">
                                  {date.googleCalendar?.eventId
                                    ? "Sincronizzata con Google"
                                    : "Non sincronizzata"}
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
                                  min="0"
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
                              </Field>

                              <div className="rounded-xl border border-[#c9573c]/10 bg-white px-4 py-3 text-sm text-[#6d7b80]">
                                <p className="mb-1 font-semibold text-[#2c395b]">
                                  Sync Google
                                </p>
                                {date.googleCalendar?.eventId ? (
                                  <a
                                    href={date.googleCalendar.htmlLink || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 font-semibold text-[#4b6b4e] underline underline-offset-4"
                                  >
                                    Apri evento Google
                                  </a>
                                ) : (
                                  <p>Ancora non sincronizzata.</p>
                                )}
                              </div>

                              <Field label="Label IT" className="xl:col-span-2">
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

                              <Field label="Label EN" className="xl:col-span-3">
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

              {showSync ? (
                <article className="rounded-[2rem] bg-[#2c395b] p-6 text-[#fef3ea] shadow-[0_24px_60px_rgba(44,57,91,0.2)] lg:p-8">
                  <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fef3ea]/60">
                        Google sync
                      </p>
                      <h3 className="mb-3 text-3xl font-bold text-white">
                        Stato configurazione e sincronizzazione manuale
                      </h3>
                      <p className="text-sm leading-7 text-[#fef3ea]/78">
                        Le credenziali Google restano lato server per sicurezza.
                        Da qui puoi capire se l&apos;OAuth e pronto e
                        sincronizzare gli eventi pubblicati verso il calendario
                        scelto.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                      <button
                        type="button"
                        disabled={syncLoading || !syncStatus?.configured}
                        onClick={handleSyncAll}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#2c395b] transition hover:bg-[#fef3ea] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon icon="hugeicons:refresh" width="18" height="18" />
                        Sync tutti i pubblicati
                      </button>
                      <button
                        type="button"
                        disabled={
                          syncLoading ||
                          !selectedSlug ||
                          !syncStatus?.configured
                        }
                        onClick={handleSyncSelected}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition border rounded-xl border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon
                          icon="hugeicons:calendar-03"
                          width="18"
                          height="18"
                        />
                        Sync evento selezionato
                      </button>
                      <button
                        type="button"
                        disabled={syncLoading || !selectedSlug}
                        onClick={handleUnsyncSelected}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition border rounded-xl border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon
                          icon="hugeicons:link-circle-02"
                          width="18"
                          height="18"
                        />
                        Rimuovi da Google
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                              syncStatus?.configured
                                ? "bg-[#dfe9df] text-[#4b6b4e]"
                                : "bg-[#f5e4d8] text-[#9c613d]"
                            }`}
                          >
                            {syncStatus?.configured
                              ? "Configurato"
                              : "Da configurare"}
                          </span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fef3ea]">
                            Timezone {syncStatus?.timeZone || DEFAULT_TIMEZONE}
                          </span>
                        </div>

                        <p className="mb-2 text-sm font-semibold text-white">
                          Calendario destinazione
                        </p>
                        <p className="mb-4 text-sm leading-6 text-[#fef3ea]/78">
                          {syncStatus?.calendarId || "Non ancora definito"}
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="p-4 rounded-xl bg-black/10">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fef3ea]/60">
                              Eventi pubblicati
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {syncStatus?.publishedEvents ?? 0}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-black/10">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fef3ea]/60">
                              Date pubblicate
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {syncStatus?.publishedDates ?? 0}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-black/10">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fef3ea]/60">
                              Date sincronizzate
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {syncStatus?.syncedDates ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                        <p className="mb-3 text-sm font-semibold text-white">
                          Variabili richieste
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "GOOGLE_CLIENT_ID",
                            "GOOGLE_CLIENT_SECRET",
                            "GOOGLE_REFRESH_TOKEN",
                            "GOOGLE_CALENDAR_ID",
                            "GOOGLE_CALENDAR_TIMEZONE",
                          ].map((item) => {
                            const missing = syncStatus?.missing?.includes(item);

                            return (
                              <span
                                key={item}
                                className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                  missing
                                    ? "bg-[#f5e4d8] text-[#9c613d]"
                                    : "bg-[#dfe9df] text-[#4b6b4e]"
                                }`}
                              >
                                {item}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                        <p className="mb-3 text-sm font-semibold text-white">
                          Come funziona la sync
                        </p>
                        <div className="space-y-3 text-sm leading-7 text-[#fef3ea]/78">
                          <p>
                            1. Crei o modifichi l&apos;evento qui
                            nell&apos;admin e lo pubblichi.
                          </p>
                          <p>
                            2. La sync legge tutte le date pubblicate e crea o
                            aggiorna gli eventi Google corrispondenti.
                          </p>
                          <p>
                            3. Se cambi titolo, descrizione, orari o meeting
                            point, basta rilanciare la sync.
                          </p>
                          <p>
                            4. Se rimuovi un evento da Google da qui, il sito
                            mantiene l&apos;evento locale ma scollega gli ID
                            Google.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                        <p className="mb-3 text-sm font-semibold text-white">
                          Evento selezionato
                        </p>
                        {selectedEvent ? (
                          <div className="space-y-3 text-sm leading-7 text-[#fef3ea]/78">
                            <p className="text-lg font-bold text-white">
                              {selectedEvent.title?.it || selectedEvent.slug}
                            </p>
                            <p>
                              Stato:{" "}
                              <strong className="text-white">
                                {selectedEvent.status === "published"
                                  ? "Pubblicato"
                                  : "Bozza"}
                              </strong>
                            </p>
                            <p>
                              Date sincronizzate:{" "}
                              <strong className="text-white">
                                {selectedEventSyncedDates}/
                                {selectedEvent.dates?.length || 0}
                              </strong>
                            </p>
                            {(selectedEvent.dates || []).some(
                              (date) => date.googleCalendar?.htmlLink,
                            ) ? (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {selectedEvent.dates.map((date) =>
                                  date.googleCalendar?.htmlLink ? (
                                    <a
                                      key={date.iso}
                                      href={date.googleCalendar.htmlLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                                    >
                                      {date.labelIt || date.iso}
                                    </a>
                                  ) : null,
                                )}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-sm leading-7 text-[#fef3ea]/78">
                            Seleziona un evento dall&apos;archivio per
                            sincronizzare solo quello.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
