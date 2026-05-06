import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import CtaPrimary from "../../components/button/CtaPrimary";
import {
  getEventBySlug,
  getEventsPageCopy,
  getEventSlugs,
} from "../../utils/events";

const MAX_EVENT_CAPACITY = 10;

function buildRecurringLabel(dates = [], locale = "it") {
  const lang = locale === "en" ? "en" : "it";
  const formatter = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "it-IT", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  });

  const monthKeys = [
    ...new Set(
      (dates || [])
        .map((date) => String(date?.iso || "").slice(0, 7))
        .filter(Boolean),
    ),
  ].sort();

  if (monthKeys.length === 0) {
    return lang === "en"
      ? "Special dates in calendar"
      : "Date speciali in calendario";
  }

  const monthLabels = monthKeys.map((key) => {
    const [year, month] = key.split("-");
    const monthDate = new Date(`${year}-${month}-01T12:00:00`);
    return formatter.format(monthDate);
  });

  if (monthLabels.length === 1) {
    return lang === "en"
      ? `Special dates in ${monthLabels[0]}`
      : `Date speciali di ${monthLabels[0]}`;
  }

  return lang === "en"
    ? `Special dates from ${monthLabels[0]} to ${monthLabels[monthLabels.length - 1]}`
    : `Date speciali da ${monthLabels[0]} a ${monthLabels[monthLabels.length - 1]}`;
}

function DateCheckoutBox({
  date,
  dates,
  lang,
  checkoutDateIso,
  bookingState,
  newsletterConsent,
  onDateChange,
  onQuantityChange,
  onAttendeeNameChange,
  onNewsletterConsentChange,
  onCheckout,
}) {
  const label = lang === "en" ? date.labelEn : date.labelIt;
  const stripeEnabled =
    Boolean(date?.stripe?.enabled) && Number(date?.stripe?.priceCents) > 0;
  const quantity = bookingState.quantity;
  const maxQuantity = Math.max(
    1,
    Math.min(MAX_EVENT_CAPACITY, Number(date?.spots || MAX_EVENT_CAPACITY)),
  );
  const unitPriceCents = Number(date?.stripe?.priceCents || 0);
  const totalPriceCents = unitPriceCents * quantity;
  const checkoutLabel = lang === "en" ? "Book now" : "Prenota ora";
  const checkoutLoadingLabel =
    lang === "en" ? "Opening checkout..." : "Apertura checkout...";
  const newsletterConsentLabel =
    lang === "en"
      ? "I agree to receive updates and newsletter emails."
      : "Acconsento a ricevere aggiornamenti e newsletter via email.";
  const newsletterConsentNote =
    lang === "en"
      ? "Optional consent. You can unsubscribe anytime."
      : "Consenso facoltativo. Potrai disiscriverti in qualsiasi momento.";
  const notAvailableLabel =
    lang === "en"
      ? "Online payment is not active for this date yet."
      : "Il pagamento online non e ancora attivo per questa data.";
  const moneyFormatter = new Intl.NumberFormat(
    lang === "en" ? "en-US" : "it-IT",
    {
      style: "currency",
      currency: String(date?.stripe?.currency || "eur").toUpperCase(),
    },
  );
  const checkoutPriceLabel = stripeEnabled
    ? moneyFormatter.format(unitPriceCents / 100)
    : "";
  const checkoutTotalPriceLabel = stripeEnabled
    ? moneyFormatter.format(totalPriceCents / 100)
    : "";

  return (
    <div className="p-4 qhd:p-6 border rounded-md border-white/10 bg-white/5">
      <label className="block mb-2 text-xs qhd:text-base font-semibold uppercase tracking-[0.22em] text-[#fef3ea]/70">
        {lang === "en" ? "Choose date" : "Scegli la data"}
      </label>
      <select
        value={date.iso}
        onChange={(event) => onDateChange(event.target.value)}
        className="w-full rounded-md border border-white/20 bg-[#2c395b] px-3 qhd:px-4 py-3 qhd:py-4 text-sm qhd:text-xl font-semibold text-white outline-none focus:border-white/45"
      >
        {(dates || []).map((option) => {
          const optionLabel = lang === "en" ? option.labelEn : option.labelIt;

          return (
            <option key={option.iso} value={option.iso}>
              {[optionLabel, option.time].filter(Boolean).join(" - ")}
            </option>
          );
        })}
      </select>

      <div className="mt-4 rounded-md bg-white/5 p-3 qhd:p-5">
        <p className="font-semibold qhd:text-2xl text-white">{label}</p>
        <p className="text-sm qhd:text-xl text-[#fef3ea]/75">{date.time}</p>
        <p className="mt-1 text-xs qhd:text-base text-[#fef3ea]/70">
          {lang === "en" ? "Available spots" : "Posti disponibili"}:{" "}
          {date.spots || MAX_EVENT_CAPACITY}
        </p>
      </div>

      {stripeEnabled ? (
        <div className="mt-3">
          <p className="mb-2 text-xs qhd:text-lg text-[#fef3ea]/75">
            {lang === "en" ? "Online payment" : "Pagamento online"}:{" "}
            <strong className="text-white">{checkoutPriceLabel}</strong>
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(quantity - 1, maxQuantity)}
              disabled={quantity <= 1}
              className="inline-flex h-8 w-8 qhd:h-11 qhd:w-11 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              -
            </button>
            <span className="min-w-[36px] qhd:min-w-[48px] text-center text-sm qhd:text-xl font-semibold text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1, maxQuantity)}
              disabled={quantity >= maxQuantity}
              className="inline-flex h-8 w-8 qhd:h-11 qhd:w-11 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              +
            </button>
            <span className="text-xs qhd:text-lg text-[#fef3ea]/75 sm:ml-2">
              {lang === "en" ? "Total" : "Totale"}:{" "}
              <strong className="text-white">{checkoutTotalPriceLabel}</strong>
            </span>
          </div>

          <div className="mb-3 space-y-2">
            {Array.from({ length: quantity }).map((_, index) => (
              <input
                key={`${date.iso}-attendee-${index}`}
                type="text"
                value={bookingState.attendeeNames?.[index] || ""}
                onChange={(event) =>
                  onAttendeeNameChange(index, event.target.value)
                }
                placeholder={
                  lang === "en"
                    ? `Participant ${index + 1} name`
                    : `Nome partecipante ${index + 1}`
                }
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 qhd:px-4 py-2 qhd:py-3 text-sm qhd:text-lg text-white placeholder:text-[#fef3ea]/60 outline-none focus:border-white/40"
              />
            ))}
          </div>

          <label className="mb-3 flex items-start gap-2 rounded-md border border-white/10 bg-white/5 p-3">
            <input
              type="checkbox"
              checked={newsletterConsent}
              onChange={(event) =>
                onNewsletterConsentChange(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-[#fef3ea]"
            />
            <span className="text-xs qhd:text-base qhd:leading-7 text-[#fef3ea]/85">
              {newsletterConsentLabel}{" "}
              <span className="text-[#fef3ea]/65">
                {newsletterConsentNote}
              </span>
            </span>
          </label>

          <button
            type="button"
            onClick={onCheckout}
            disabled={checkoutDateIso === date.iso}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 qhd:px-5 py-2 qhd:py-3 text-xs qhd:text-base font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon icon="hugeicons:credit-card" width="14" height="14" />
            {checkoutDateIso === date.iso ? checkoutLoadingLabel : checkoutLabel}
          </button>
        </div>
      ) : (
        <p className="mt-3 rounded-md border border-[#f8b7a8]/30 bg-[#f8b7a8]/10 px-3 py-2 text-sm text-[#fef3ea]">
          {notAvailableLabel}
        </p>
      )}
    </div>
  );
}

export default function EventDetailPage({ event, copy, locale }) {
  const router = useRouter();
  const [selectedDateIso, setSelectedDateIso] = useState("");
  const [checkoutDateIso, setCheckoutDateIso] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [bookingByDate, setBookingByDate] = useState({});
  const [newsletterConsentByDate, setNewsletterConsentByDate] = useState({});
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const lang = locale === "en" ? "en" : "it";
  const checkoutStatus = useMemo(() => {
    const rawStatus = router.query.checkout;
    return typeof rawStatus === "string" ? rawStatus : "";
  }, [router.query.checkout]);
  const gallery = event?.gallery || [];
  const visibleGallery = gallery.length > 5 ? gallery.slice(0, 5) : gallery;
  const hiddenGalleryCount = Math.max(gallery.length - visibleGallery.length, 0);
  const activeGalleryImage =
    activeGalleryIndex !== null ? gallery[activeGalleryIndex] : null;
  const showMoreGalleryLabel =
    lang === "en" ? "View the others" : "Guarda le altre";
  const selectedDate = useMemo(() => {
    if (!event?.dates?.length) {
      return null;
    }

    return (
      event.dates.find((date) => date.iso === selectedDateIso) ||
      event.dates[0]
    );
  }, [event?.dates, selectedDateIso]);


  // 🔹 DB (solo contenuti evento)
  useEffect(() => {
    if (activeGalleryIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveGalleryIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveGalleryIndex((current) =>
          current === null ? current : (current + 1) % gallery.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveGalleryIndex((current) =>
          current === null
            ? current
            : (current - 1 + gallery.length) % gallery.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGalleryIndex, gallery.length]);

  useEffect(() => {
    if (!event?.dates?.length) {
      setSelectedDateIso("");
      return;
    }

    setSelectedDateIso((current) =>
      event.dates.some((date) => date.iso === current)
        ? current
        : event.dates[0].iso,
    );
  }, [event?.dates]);

  if (!event) return null;

  const title = event.title;
  const excerpt = event.excerpt;
  const category = event.category;
  const duration = event.duration;
  const price = event.price;
  const languages = event.languages;
  const meetingPoint = event.meetingPoint;
  const meetingPointLink = event.meetingPointLink;
  const recurring = buildRecurringLabel(event.dates || [], lang);
  const groupSizeLabel = lang === "en" ? "Min 4 - Max 10" : "Min 4 - Max 10";
  const bookingNote =
    lang === "en"
      ? "Booking by email. You will receive confirmation and details as soon as possible."
      : "Prenotazione via email. Riceverai conferma e dettagli il prima possibile.";

  function getDateBookingState(dateIso) {
    const current = bookingByDate[dateIso];

    if (current) {
      return current;
    }

    return {
      quantity: 1,
      attendeeNames: [""],
    };
  }

  function updateDateQuantity(dateIso, nextQuantity, maxQuantity = MAX_EVENT_CAPACITY) {
    setBookingByDate((current) => {
      const prev = current[dateIso] || { quantity: 1, attendeeNames: [""] };
      const clamped = Math.max(1, Math.min(maxQuantity, nextQuantity));
      const names = Array.from({ length: clamped }, (_, index) =>
        prev.attendeeNames?.[index] ? prev.attendeeNames[index] : "",
      );

      return {
        ...current,
        [dateIso]: {
          quantity: clamped,
          attendeeNames: names,
        },
      };
    });
  }

  function updateAttendeeName(dateIso, index, value) {
    setBookingByDate((current) => {
      const prev = current[dateIso] || { quantity: 1, attendeeNames: [""] };
      const names = Array.from({ length: prev.quantity }, (_, i) =>
        i === index ? value : prev.attendeeNames?.[i] || "",
      );

      return {
        ...current,
        [dateIso]: {
          ...prev,
          attendeeNames: names,
        },
      };
    });
  }

  function getNewsletterConsent(dateIso) {
    return Boolean(newsletterConsentByDate[dateIso]);
  }

  function updateNewsletterConsent(dateIso, accepted) {
    setNewsletterConsentByDate((current) => ({
      ...current,
      [dateIso]: Boolean(accepted),
    }));
  }

  async function startStripeCheckout(date) {
    setCheckoutError("");
    setCheckoutDateIso(date.iso);

    try {
      const bookingState = getDateBookingState(date.iso);
      const newsletterConsent = getNewsletterConsent(date.iso);
      const attendeeNames = (bookingState.attendeeNames || [])
        .slice(0, bookingState.quantity)
        .map((item) => String(item || "").trim())
        .filter(Boolean);

      const response = await fetch("/api/events/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: event.slug,
          dateIso: date.iso,
          locale: lang,
          quantity: bookingState.quantity,
          attendeeNames,
          newsletterConsent,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Impossibile avviare il checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(error.message || "Errore durante il checkout.");
      setCheckoutDateIso("");
    }
  }

  const description = event.description || [];
  const included = event.included || [];
  const subject = `Richiesta informazioni per ${title}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={event.heroImage} />
      </Head>

      <div className="w-11/12 qhd:max-w-[2304px] pb-20 qhd:pb-32 mx-auto">
        {/* BACK */}
        <div className="mt-10 qhd:mt-14 mb-8 lg:px-10 qhd:px-0">
          <Link
            href="/eventi"
            className="inline-flex items-center gap-2 text-xl qhd:text-3xl text-principle"
          >
            <Icon icon="lets-icons:refund-back" />
            {copy?.detail?.back}
          </Link>
        </div>

        {/* HERO */}
        <section className="grid grid-cols-1 gap-8 qhd:gap-16 lg:px-10 qhd:px-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-4 qhd:gap-7">
            <span className="inline-flex max-w-max rounded-full bg-[#CE9486]/20 px-4 qhd:px-5 py-2 qhd:py-3 text-xs qhd:text-lg font-semibold uppercase tracking-[0.24em] text-[#c9573c]">
              {category}
            </span>

            <MaskText>
              <h1 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] qhd:text-[6.6rem] font-bold leading-none text-principle">
                {title}
              </h1>
            </MaskText>

            <p className="max-w-3xl qhd:max-w-5xl text-base leading-7 text-para lg:text-lg qhd:text-2xl qhd:leading-10">
              {excerpt}
            </p>
          </div>

          <div className="relative h-[380px] overflow-hidden rounded-md lg:h-[620px] qhd:h-[826px]">
            <Image
              src={event.heroImage}
              alt={title}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 gap-8 qhd:gap-14 py-16 qhd:py-24 lg:px-10 qhd:px-0 xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="space-y-8">
            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8 qhd:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.infoTitle}
              </p>

              <div className="space-y-4 qhd:space-y-6 text-base leading-8 text-para lg:text-lg qhd:text-2xl qhd:leading-10">
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>

            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8 qhd:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.includedTitle}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {included.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-[#fff8f4] p-5 qhd:p-7 text-md qhd:text-xl qhd:leading-8 text-para"
                  >
                    <Icon
                      icon="hugeicons:checkmark-badge-01"
                      className="mb-3"
                    />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <article className="rounded-md bg-[#2c395b] p-6 text-[#fef3ea] lg:p-8 qhd:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fef3ea]/60">
                {copy?.detail?.nextDates}
              </p>

              <h2 className="mb-5 text-3xl qhd:text-5xl font-bold text-white">
                {recurring}
              </h2>
              <p className="mb-5 text-sm text-[#fef3ea]/75">{groupSizeLabel}</p>
              {checkoutStatus === "success" ? (
                <p className="mb-4 rounded-md border border-[#9ac6a2]/35 bg-[#9ac6a2]/20 px-3 py-2 text-sm text-[#fef3ea]">
                  {lang === "en"
                    ? "Payment completed. We will contact you shortly with details."
                    : "Pagamento completato. Ti contatteremo presto con i dettagli."}
                </p>
              ) : null}
              {checkoutStatus === "cancel" ? (
                <p className="mb-4 rounded-md border border-[#e7c197]/35 bg-[#e7c197]/20 px-3 py-2 text-sm text-[#fef3ea]">
                  {lang === "en"
                    ? "Checkout canceled. You can retry anytime."
                    : "Checkout annullato. Puoi riprovare quando vuoi."}
                </p>
              ) : null}
              {checkoutError ? (
                <p className="mb-4 rounded-md border border-[#f8b7a8]/35 bg-[#f8b7a8]/20 px-3 py-2 text-sm text-[#fef3ea]">
                  {checkoutError}
                </p>
              ) : null}

              {selectedDate ? (
                <DateCheckoutBox
                  date={selectedDate}
                  dates={event.dates || []}
                  lang={lang}
                  checkoutDateIso={checkoutDateIso}
                  bookingState={getDateBookingState(selectedDate.iso)}
                  newsletterConsent={getNewsletterConsent(selectedDate.iso)}
                  onDateChange={setSelectedDateIso}
                  onQuantityChange={(nextQuantity, maxQuantity) =>
                    updateDateQuantity(
                      selectedDate.iso,
                      nextQuantity,
                      maxQuantity,
                    )
                  }
                  onAttendeeNameChange={(index, value) =>
                    updateAttendeeName(selectedDate.iso, index, value)
                  }
                  onNewsletterConsentChange={(accepted) =>
                    updateNewsletterConsent(selectedDate.iso, accepted)
                  }
                  onCheckout={() => startStripeCheckout(selectedDate)}
                />
              ) : null}

              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-md bg-white/5">
                  <p className="text-xs uppercase text-[#fef3ea]/60">
                    {copy?.detail?.meetingPoint}
                  </p>
                  {meetingPointLink ? (
                    <a
                      href={meetingPointLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                    >
                      <Icon icon="hugeicons:maps-location-01" width="14" height="14" />
                      {meetingPoint} (
                      {lang === "en" ? "Open in Google Maps" : "Apri su Google Maps"})
                    </a>
                  ) : (
                    <p className="text-sm">{meetingPoint}</p>
                  )}
                </div>

                <CtaPrimary
                  link={`mailto:luisaquaglia.tourguide@gmail.com?subject=${subject}`}
                  className="!w-full"
                >
                  {lang === "en" ? "Ask for info" : "Chiedi informazioni"}
                </CtaPrimary>
                <p className="text-xs text-[#fef3ea]/70">{bookingNote}</p>
              </div>
            </article>
            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.detail.galleryTitle}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {gallery.length > 0 ? (
                  visibleGallery.map((image, index) => {
                    const isMoreTile =
                      hiddenGalleryCount > 0 && index === visibleGallery.length - 1;

                    return (
                      <button
                        type="button"
                        onClick={() => setActiveGalleryIndex(index)}
                        key={`${image}-${index}`}
                        aria-label={
                          isMoreTile
                            ? `${showMoreGalleryLabel}: ${hiddenGalleryCount}`
                            : `${event.title} ${index + 1}`
                        }
                        className={`group relative overflow-hidden rounded-md text-left ${
                          index === 0 ? "sm:col-span-2 h-[260px]" : "h-[180px]"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${event.title} ${index + 1}`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                        {isMoreTile ? (
                          <span className="absolute inset-0 flex flex-col items-center justify-center bg-[#2c395b]/70 px-4 text-center text-white">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                              {showMoreGalleryLabel}
                            </span>
                            <span className="mt-2 text-3xl font-bold">
                              +{hiddenGalleryCount}
                            </span>
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-para">{copy.detail.noGallery}</p>
                )}
              </div>
            </article>
          </div>
        </section>
      </div>
      {activeGalleryImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/90 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={copy.detail.galleryTitle}
          onClick={() => setActiveGalleryIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveGalleryIndex(null);
            }}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={lang === "en" ? "Close gallery" : "Chiudi gallery"}
          >
            <Icon icon="hugeicons:cancel-01" width="22" height="22" />
          </button>

          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveGalleryIndex(
                  (activeGalleryIndex - 1 + gallery.length) % gallery.length,
                );
              }}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={lang === "en" ? "Previous image" : "Immagine precedente"}
            >
              <Icon icon="hugeicons:arrow-left-02" width="24" height="24" />
            </button>
          ) : null}

          <div
            className="relative h-[78vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeGalleryImage}
              alt={`${event.title} ${activeGalleryIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 92vw, 1024px"
              className="object-contain"
              unoptimized
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-sm text-white">
              {activeGalleryIndex + 1} / {gallery.length}
            </div>
          </div>

          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveGalleryIndex((activeGalleryIndex + 1) % gallery.length);
              }}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label={lang === "en" ? "Next image" : "Immagine successiva"}
            >
              <Icon icon="hugeicons:arrow-right-02" width="24" height="24" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export async function getStaticProps({ params, locale = "it" }) {
  const lang = locale === "en" ? "en" : "it";

  const event = await getEventBySlug(params.slug, lang);
  const copy = await getEventsPageCopy(lang);

  if (!event) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: { event, copy, locale: lang },
    revalidate: 60,
  };
}
export async function getStaticPaths() {
  const slugs = await getEventSlugs();
  const locales = ["it", "en"];

  return {
    paths: locales.flatMap((locale) =>
      slugs.map((slug) => ({
        params: { slug },
        locale,
      })),
    ),
    fallback: "blocking",
  };
}
