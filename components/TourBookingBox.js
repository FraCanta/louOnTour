import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

function getMonthDays(monthKey) {
  if (!monthKey) return [];
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const mondayOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }),
  ];
}

export default function TourBookingBox({ tour, locale = "it", checkoutStatus = "" }) {
  const router = useRouter();
  const lang = locale === "en" ? "en" : "it";
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [extension, setExtension] = useState(false);
  const [attendees, setAttendees] = useState(1);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/tours?action=availability&slug=${encodeURIComponent(tour.slug)}&locale=${lang}`)
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; })
      .then((data) => {
        if (!active) return;
        const nextAvailability = data.availability || [];
        const firstDate = nextAvailability[0]?.date || "";
        setAvailability(nextAvailability);
        setDate(firstDate);
        setVisibleMonth(firstDate.slice(0, 7));
      })
      .catch((loadError) => active && setError(loadError.message));
    return () => { active = false; };
  }, [lang, tour.slug]);

  const day = useMemo(() => availability.find((item) => item.date === date), [availability, date]);
  const availableDates = useMemo(() => new Set(availability.map((item) => item.date)), [availability]);
  const availableMonths = useMemo(() => [...new Set(availability.map((item) => item.date.slice(0, 7)))], [availability]);
  const monthIndex = availableMonths.indexOf(visibleMonth);
  const calendarDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const monthLabel = visibleMonth
    ? new Intl.DateTimeFormat(lang === "en" ? "en-US" : "it-IT", { month: "long", year: "numeric" }).format(new Date(`${visibleMonth}-01T12:00:00`))
    : "";
  const weekDays = lang === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  useEffect(() => { setStartsAt(day?.slots?.[0]?.startsAt || ""); }, [day]);
  const priceCents = Number(tour.base_price_cents || 0) + (extension ? Number(tour.extension_price_cents || 0) : 0);
  const totalCents = tour.price_mode === "per_person" ? priceCents * attendees : priceCents;
  const money = new Intl.NumberFormat(lang === "en" ? "en-US" : "it-IT", { style: "currency", currency: String(tour.currency || "eur").toUpperCase() });

  async function checkout() {
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/tours?action=checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: tour.slug, locale: lang, startsAt, extensionSelected: extension, attendeeCount: attendees, termsAccepted: terms }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout non disponibile.");
      window.location.href = data.url;
    } catch (checkoutError) { setError(checkoutError.message); setLoading(false); }
  }

  return (
    <article id="prenotazione" className="scroll-mt-6 rounded-md bg-[#2c395b] p-6 text-[#fef3ea] lg:p-8 qhd:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{lang === "en" ? "Book this tour" : "Prenota questo tour"}</p>
      <h2 className="mt-2 text-3xl font-bold text-white qhd:text-5xl">{lang === "en" ? "Choose date and time" : "Scegli data e orario"}</h2>
      <p className="mt-3 text-sm text-white/70">{lang === "en" ? "Select one of the available slots and complete the secure payment with Stripe." : "Seleziona una disponibilita e completa il pagamento sicuro con Stripe."}</p>
      {(router.query.checkout || checkoutStatus) === "success" ? <p className="mt-4 rounded-md border border-[#9ac6a2]/35 bg-[#9ac6a2]/20 p-3">{lang === "en" ? "Payment completed. We will contact you shortly with details." : "Pagamento completato. Ti contatteremo presto con i dettagli."}</p> : null}
      {(router.query.checkout || checkoutStatus) === "cancel" ? <p className="mt-4 rounded-md border border-[#e7c197]/35 bg-[#e7c197]/20 p-3">{lang === "en" ? "Checkout canceled. You can retry anytime." : "Checkout annullato. Puoi riprovare quando vuoi."}</p> : null}
      {error ? <p role="alert" className="mt-4 rounded-md border border-[#f8b7a8]/35 bg-[#f8b7a8]/20 p-3">{error}</p> : null}
      <div className="mx-auto mt-5 w-full max-w-[320px] rounded-md border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <button type="button" onClick={() => setVisibleMonth(availableMonths[monthIndex - 1])} disabled={monthIndex <= 0} aria-label={lang === "en" ? "Previous month" : "Mese precedente"} className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-lg disabled:cursor-not-allowed disabled:opacity-30">‹</button>
          <h3 className="text-center text-sm font-semibold capitalize text-white">{monthLabel}</h3>
          <button type="button" onClick={() => setVisibleMonth(availableMonths[monthIndex + 1])} disabled={monthIndex < 0 || monthIndex >= availableMonths.length - 1} aria-label={lang === "en" ? "Next month" : "Mese successivo"} className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-lg disabled:cursor-not-allowed disabled:opacity-30">›</button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center" role="grid" aria-label={lang === "en" ? "Tour availability calendar" : "Calendario disponibilita tour"}>
          {weekDays.map((weekDay) => <span key={weekDay} className="py-1 text-[10px] font-semibold uppercase text-white/50 sm:text-xs">{weekDay}</span>)}
          {calendarDays.map((calendarDate, index) => {
            if (!calendarDate) return <span key={`empty-${index}`} aria-hidden="true" />;
            const isAvailable = availableDates.has(calendarDate);
            const isSelected = calendarDate === date;
            const label = new Date(`${calendarDate}T12:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "it-IT", { dateStyle: "full" });
            return <button key={calendarDate} type="button" disabled={!isAvailable} aria-label={label} aria-pressed={isSelected} onClick={() => setDate(calendarDate)} className={`h-9 rounded text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-white ${isSelected ? "bg-[#CE9486] text-[#2c395b]" : isAvailable ? "bg-white text-[#2c395b] hover:bg-[#fef3ea]" : "text-white/25"}`}>{Number(calendarDate.slice(-2))}</button>;
          })}
        </div>
        {!availability.length && !error ? <p className="py-6 text-center text-sm text-white/70">{lang === "en" ? "Loading available dates..." : "Caricamento date disponibili..."}</p> : null}
      </div>
      {date ? <p className="mt-3 text-center text-sm text-white/75">{lang === "en" ? "Selected" : "Selezionata"}: <strong className="text-white">{new Date(`${date}T12:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "it-IT", { dateStyle: "long" })}</strong></p> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm"><span>{lang === "en" ? "Time" : "Orario"}</span><select className="w-full rounded-md bg-white p-3 text-[#2c395b]" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}>{(day?.slots || []).map((slot) => <option key={slot.startsAt} value={slot.startsAt}>{slot.startTime} - {slot.endTime}</option>)}</select></label>
        <label className="space-y-2 text-sm"><span>{lang === "en" ? "Participants" : "Partecipanti"}</span><input type="number" min="1" max="20" className="w-full rounded-md bg-white p-3 text-[#2c395b]" value={attendees} onChange={(e) => setAttendees(Math.max(1, Number(e.target.value)))} /></label>
        {tour.extension_enabled ? <label className="flex items-center gap-3 rounded-md bg-white/5 p-4"><input type="checkbox" checked={extension} onChange={(e) => setExtension(e.target.checked)} /><span>+{tour.extension_minutes} min · {money.format(Number(tour.extension_price_cents) / 100)}</span></label> : null}
      </div>
      <div className="mt-5 rounded-md bg-white/5 p-4"><div className="flex flex-wrap items-center justify-between gap-4"><span className="text-sm text-white/70">{lang === "en" ? "Order total" : "Totale ordine"}</span><strong className="text-2xl text-white">{money.format(totalCents / 100)} {tour.price_mode === "per_booking" ? (lang === "en" ? "total" : "totale") : ""}</strong></div></div>
      <label className="mt-5 flex items-start gap-2 text-sm"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1" /><span>{lang === "en" ? "I have read and accept the" : "Ho letto e accetto i"} <Link className="underline underline-offset-4" href="/termini-condizioni" target="_blank">{lang === "en" ? "terms and conditions" : "Termini e condizioni di acquisto"}</Link></span></label>
      <button type="button" disabled={!startsAt || !terms || loading} onClick={checkout} className="mt-5 w-full rounded-md bg-[#77674e] px-6 py-3 font-semibold text-white transition hover:bg-[#695b46] focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50">{loading ? (lang === "en" ? "Opening checkout..." : "Apertura checkout...") : (lang === "en" ? "Book and pay" : "Prenota e paga")}</button>
      <div className="mt-6 rounded-md bg-white/5 p-4">
        <p className="text-xs uppercase text-white/60">{lang === "en" ? "Meeting point" : "Punto d'incontro"}</p>
        {tour.meetingPointLink ? <a href={tour.meetingPointLink} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm underline underline-offset-4">{tour.meetingPoint || (lang === "en" ? "Open in Google Maps" : "Apri in Google Maps")}</a> : <p className="mt-1 text-sm">{tour.meetingPoint || (lang === "en" ? "Provided after booking" : "Comunicato dopo la prenotazione")}</p>}
      </div>
      <a href={`mailto:luisaquaglia.tourguide@gmail.com?subject=${encodeURIComponent(`${lang === "en" ? "Information about" : "Informazioni su"} ${tour.title}`)}`} className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10">{lang === "en" ? "Ask for info" : "Chiedi informazioni"}</a>
    </article>
  );
}
