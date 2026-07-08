import { useCallback, useEffect, useState } from "react";
import { uploadEventImage } from "../utils/uploadEventImage";

const emptyTour = {
  slug: "", status: "draft", featured: false, hero_image: "", gallery: [],
  title: { it: "", en: "" }, excerpt: { it: "", en: "" }, location: { it: "", en: "" },
  duration_minutes: 120, price_mode: "per_booking", base_price_cents: 18800, currency: "eur",
  extension_enabled: true, extension_minutes: 30, extension_price_cents: 2000,
  meeting_point: { it: "", en: "", link: "" }, languages: { it: "Italiano", en: "Italian" },
  included: { it: [], en: [] }, description: { it: [], en: [] },
  availability_rules: [{ startTime: "10:30", endTime: "12:30" }, { startTime: "14:30", endTime: "16:30" }],
  booking_horizon_days: 180, minimum_notice_hours: 48,
};

const inputClass = "w-full rounded-md border border-[#c9573c]/15 bg-white px-3 py-2 text-sm text-[#2c395b] outline-none focus:border-[#c9573c]/50";
const labelClass = "space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6d7b80]";
const lines = (value) => String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
const euros = (cents) => (Number(cents || 0) / 100).toFixed(2);

function toForm(tour) {
  return { ...emptyTour, ...tour, hero_image: tour.hero_image || "", galleryText: (tour.gallery || []).join("\n"), includedIt: (tour.included?.it || []).join("\n"), includedEn: (tour.included?.en || []).join("\n"), descriptionIt: (tour.description?.it || []).join("\n\n"), descriptionEn: (tour.description?.en || []).join("\n\n"), basePriceEuro: euros(tour.base_price_cents), extensionPriceEuro: euros(tour.extension_price_cents) };
}

function freshForm() {
  return toForm(emptyTour);
}

function payload(form, status) {
  return {
    ...form, status, gallery: lines(form.galleryText),
    base_price_cents: Math.round(Number(form.basePriceEuro || 0) * 100),
    extension_price_cents: Math.round(Number(form.extensionPriceEuro || 0) * 100),
    included: { it: lines(form.includedIt), en: lines(form.includedEn) },
    description: { it: String(form.descriptionIt || "").split(/\n\s*\n/).filter(Boolean), en: String(form.descriptionEn || "").split(/\n\s*\n/).filter(Boolean) },
  };
}

export default function TourAdminPanel({ adminKey }) {
  const [tours, setTours] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState(freshForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [google, setGoogle] = useState({ connected: false });
  const [bookings, setBookings] = useState([]);
  const [block, setBlock] = useState({ title: "Non disponibile", date: "", startTime: "10:30", endTime: "12:30" });

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${adminKey}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Operazione non riuscita.");
    return data;
  }, [adminKey]);

  const load = useCallback(async () => {
    if (!adminKey) return;
    try {
      const [tourData, googleData, bookingData] = await Promise.all([request("/api/admin/tours"), request("/api/admin/google-calendar"), request("/api/admin/tours?action=bookings")]);
      setTours(tourData.tours || []);
      setGoogle(googleData);
      setBookings(bookingData.bookings || []);
    } catch (loadError) { setError(loadError.message); }
  }, [adminKey, request]);

  useEffect(() => { load(); }, [load]);

  function field(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  function nested(group, lang, value) { setForm((current) => ({ ...current, [group]: { ...(current[group] || {}), [lang]: value } })); }
  function choose(tour) { setSelectedSlug(tour.slug); setForm(toForm(tour)); setMessage(""); setError(""); }
  function createNew() { setSelectedSlug(""); setForm(freshForm()); setMessage(""); setError(""); }

  async function save(status) {
    if (!form.slug || !form.title.it || !form.title.en) { setError("Slug e titoli IT/EN sono obbligatori."); return; }
    setBusy(true); setError("");
    try {
      const data = await request(selectedSlug ? `/api/admin/tours?slug=${encodeURIComponent(selectedSlug)}` : "/api/admin/tours", { method: selectedSlug ? "PUT" : "POST", body: JSON.stringify(payload(form, status)) });
      setSelectedSlug(data.tour.slug); setForm(toForm(data.tour)); setMessage(status === "published" ? "Tour pubblicato." : "Bozza salvata."); await load();
    } catch (saveError) { setError(saveError.message); } finally { setBusy(false); }
  }

  async function remove() {
    if (!selectedSlug || !window.confirm("Eliminare questo tour?")) return;
    setBusy(true);
    try { await request(`/api/admin/tours?slug=${encodeURIComponent(selectedSlug)}`, { method: "DELETE" }); createNew(); await load(); setMessage("Tour eliminato."); } catch (removeError) { setError(removeError.message); } finally { setBusy(false); }
  }

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    try { field("hero_image", await uploadEventImage(file, adminKey)); setMessage("Immagine caricata."); } catch (uploadError) { setError(uploadError.message); } finally { setBusy(false); }
  }

  async function googleAction(action) {
    setBusy(true); setError("");
    try {
      if (action === "authorize") { const data = await request("/api/admin/google-calendar?action=authorize"); window.location.href = data.url; return; }
      const data = await request(`/api/admin/google-calendar?action=${action}`, { method: "POST" });
      setMessage(action === "sync" ? `Sincronizzazione completata: ${data.imported || 0} eventi.` : "Canale Google Calendar rinnovato."); await load();
    } catch (googleError) { setError(googleError.message); } finally { setBusy(false); }
  }

  async function addBlock() {
    if (!block.date) { setError("Seleziona la data da bloccare."); return; }
    setBusy(true);
    try {
      await request("/api/admin/calendar", { method: "POST", body: JSON.stringify({ title: block.title, date: block.date, startTime: block.startTime, endTime: block.endTime }) });
      setMessage("Fascia bloccata nel calendario.");
    } catch (blockError) { setError(blockError.message); } finally { setBusy(false); }
  }

  async function importLegacy() {
    setBusy(true); setError("");
    try { const data = await request("/api/admin/tours?action=import", { method: "POST", body: "{}" }); setMessage(`${data.tours?.length || 0} tour importati.`); await load(); }
    catch (importError) { setError(importError.message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9573c]">Catalogo</p><h1 className="text-3xl font-bold text-[#2c395b]">Tour canonici</h1></div><div className="flex gap-2"><button onClick={importLegacy} className="rounded-md border border-[#c9573c]/30 px-4 py-2 text-sm font-semibold text-[#c9573c]">Importa tour attuali</button><button onClick={createNew} className="rounded-md bg-[#c9573c] px-4 py-2 text-sm font-semibold text-white">Nuovo tour</button></div></header>
      {error ? <p className="rounded-md bg-[#fff1ec] p-3 text-sm text-[#b74d33]">{error}</p> : null}
      {message ? <p className="rounded-md bg-[#edf7ee] p-3 text-sm text-[#4b6b4e]">{message}</p> : null}

      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-2 rounded-md border border-[#c9573c]/10 bg-white p-4">
          {tours.map((tour) => <button key={tour.slug} onClick={() => choose(tour)} className={`w-full rounded-md p-3 text-left ${selectedSlug === tour.slug ? "bg-[#fff1ec]" : "bg-[#fffaf7]"}`}><strong className="block text-[#2c395b]">{tour.title?.it || tour.slug}</strong><span className="text-xs text-[#6d7b80]">{tour.status} · {euros(tour.base_price_cents)} EUR</span></button>)}
          {!tours.length ? <p className="text-sm text-[#6d7b80]">Nessun tour nel database.</p> : null}
        </aside>

        <div className="space-y-6">
          <article className="space-y-5 rounded-md border border-[#c9573c]/10 bg-white p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <label className={labelClass}>Slug<input className={inputClass} value={form.slug} onChange={(e) => field("slug", e.target.value)} /></label>
              <label className={labelClass}>Stato<select className={inputClass} value={form.status} onChange={(e) => field("status", e.target.value)}><option value="draft">Bozza</option><option value="published">Pubblicato</option></select></label>
              <label className={labelClass}>Destinazione IT<input className={inputClass} value={form.location?.it || ""} onChange={(e) => nested("location", "it", e.target.value)} /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Titolo IT<input className={inputClass} value={form.title?.it || ""} onChange={(e) => nested("title", "it", e.target.value)} /></label>
              <label className={labelClass}>Titolo EN<input className={inputClass} value={form.title?.en || ""} onChange={(e) => nested("title", "en", e.target.value)} /></label>
              <label className={labelClass}>Estratto IT<textarea className={inputClass} rows="3" value={form.excerpt?.it || ""} onChange={(e) => nested("excerpt", "it", e.target.value)} /></label>
              <label className={labelClass}>Estratto EN<textarea className={inputClass} rows="3" value={form.excerpt?.en || ""} onChange={(e) => nested("excerpt", "en", e.target.value)} /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2"><label className={labelClass}>Immagine principale<input className={inputClass} value={form.hero_image || ""} onChange={(e) => field("hero_image", e.target.value)} /></label><label className={labelClass}>Carica immagine<input type="file" accept="image/*" className={inputClass} onChange={(e) => upload(e.target.files?.[0])} /></label></div>
            <label className={labelClass}>Galleria, un URL per riga<textarea className={inputClass} rows="4" value={form.galleryText || ""} onChange={(e) => field("galleryText", e.target.value)} /></label>
            <div className="grid gap-4 md:grid-cols-2"><label className={labelClass}>Descrizione IT<textarea className={inputClass} rows="7" value={form.descriptionIt || ""} onChange={(e) => field("descriptionIt", e.target.value)} /></label><label className={labelClass}>Descrizione EN<textarea className={inputClass} rows="7" value={form.descriptionEn || ""} onChange={(e) => field("descriptionEn", e.target.value)} /></label></div>
          </article>

          <article className="space-y-4 rounded-md border border-[#c9573c]/10 bg-white p-5"><h2 className="text-xl font-bold text-[#2c395b]">Prezzo e disponibilita</h2><div className="grid gap-4 md:grid-cols-4">
            <label className={labelClass}>Prezzo base EUR<input type="number" step="0.50" className={inputClass} value={form.basePriceEuro} onChange={(e) => field("basePriceEuro", e.target.value)} /></label>
            <label className={labelClass}>Tariffa<select className={inputClass} value={form.price_mode} onChange={(e) => field("price_mode", e.target.value)}><option value="per_booking">Complessiva</option><option value="per_person">Per persona</option></select></label>
            <label className={labelClass}>Durata minuti<input type="number" className={inputClass} value={form.duration_minutes} onChange={(e) => field("duration_minutes", Number(e.target.value))} /></label>
            <label className={labelClass}>Preavviso ore<input type="number" className={inputClass} value={form.minimum_notice_hours} onChange={(e) => field("minimum_notice_hours", Number(e.target.value))} /></label>
            <label className={labelClass}>Supplemento EUR<input type="number" step="0.50" className={inputClass} value={form.extensionPriceEuro} onChange={(e) => field("extensionPriceEuro", e.target.value)} /></label>
            <label className={labelClass}>Minuti supplemento<input type="number" className={inputClass} value={form.extension_minutes} onChange={(e) => field("extension_minutes", Number(e.target.value))} /></label>
            <label className={labelClass}>Orizzonte giorni<input type="number" className={inputClass} value={form.booking_horizon_days} onChange={(e) => field("booking_horizon_days", Number(e.target.value))} /></label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2c395b]"><input type="checkbox" checked={form.extension_enabled} onChange={(e) => field("extension_enabled", e.target.checked)} /> Supplemento attivo</label>
          </div><div className="grid gap-4 md:grid-cols-2">{(form.availability_rules || []).map((slot, index) => <div key={index} className="grid grid-cols-2 gap-2 rounded-md bg-[#fffaf7] p-3"><label className={labelClass}>Inizio<input type="time" className={inputClass} value={slot.startTime} onChange={(e) => field("availability_rules", form.availability_rules.map((item, i) => i === index ? { ...item, startTime: e.target.value } : item))} /></label><label className={labelClass}>Fine<input type="time" className={inputClass} value={slot.endTime} onChange={(e) => field("availability_rules", form.availability_rules.map((item, i) => i === index ? { ...item, endTime: e.target.value } : item))} /></label></div>)}</div></article>

          <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => save("draft")} className="rounded-md border border-[#c9573c]/30 px-4 py-2 font-semibold text-[#c9573c]">Salva bozza</button><button disabled={busy} onClick={() => save("published")} className="rounded-md bg-[#c9573c] px-4 py-2 font-semibold text-white">Pubblica</button>{selectedSlug ? <button disabled={busy} onClick={remove} className="rounded-md bg-[#2c395b] px-4 py-2 font-semibold text-white">Elimina</button> : null}</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2"><article className="space-y-4 rounded-md border border-[#c9573c]/10 bg-white p-5"><h2 className="text-xl font-bold text-[#2c395b]">Google Calendar</h2><p className="text-sm text-[#6d7b80]">{google.connected ? `Collegato${google.connection?.channel_expiration ? ` · webhook fino al ${new Date(google.connection.channel_expiration).toLocaleString("it-IT")}` : ""}` : "Non collegato"}</p><div className="flex flex-wrap gap-2">{!google.connected ? <button onClick={() => googleAction("authorize")} className="rounded-md bg-[#2c395b] px-4 py-2 text-sm font-semibold text-white">Collega Google</button> : <><button onClick={() => googleAction("sync")} className="rounded-md bg-[#2c395b] px-4 py-2 text-sm font-semibold text-white">Sincronizza ora</button><button onClick={() => googleAction("watch")} className="rounded-md border border-[#2c395b]/20 px-4 py-2 text-sm font-semibold text-[#2c395b]">Rinnova webhook</button></>}</div></article>
        <article className="space-y-4 rounded-md border border-[#c9573c]/10 bg-white p-5"><h2 className="text-xl font-bold text-[#2c395b]">Blocca una fascia</h2><div className="grid gap-3 sm:grid-cols-2"><input className={inputClass} value={block.title} onChange={(e) => setBlock({ ...block, title: e.target.value })} /><input type="date" className={inputClass} value={block.date} onChange={(e) => setBlock({ ...block, date: e.target.value })} /><input type="time" className={inputClass} value={block.startTime} onChange={(e) => setBlock({ ...block, startTime: e.target.value })} /><input type="time" className={inputClass} value={block.endTime} onChange={(e) => setBlock({ ...block, endTime: e.target.value })} /></div><button onClick={addBlock} className="rounded-md bg-[#77674e] px-4 py-2 text-sm font-semibold text-white">Blocca nel calendario</button></article></section>
    </div>
  );
}
