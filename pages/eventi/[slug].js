import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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

export default function EventDetailPage({ event, copy, locale }) {
  const router = useRouter();
  const [checkoutDateIso, setCheckoutDateIso] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [bookingByDate, setBookingByDate] = useState({});
  const lang = locale === "en" ? "en" : "it";
  const checkoutStatus = useMemo(() => {
    const rawStatus = router.query.checkout;
    return typeof rawStatus === "string" ? rawStatus : "";
  }, [router.query.checkout]);

  if (!event) return null;

  // 🔹 DB (solo contenuti evento)
  const title = event.title;
  const excerpt = event.excerpt;
  const category = event.category;
  const duration = event.duration;
  const price = event.price;
  const languages = event.languages;
  const meetingPoint = event.meetingPoint;
  const meetingPointLink = event.meetingPointLink;
  const recurring = buildRecurringLabel(event.dates || [], lang);
  const gallery = event.gallery || [];
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

  async function startStripeCheckout(date) {
    setCheckoutError("");
    setCheckoutDateIso(date.iso);

    try {
      const bookingState = getDateBookingState(date.iso);
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

      <div className="w-11/12 pb-20 mx-auto">
        {/* BACK */}
        <div className="mt-10 mb-8 lg:px-10">
          <Link
            href="/eventi"
            className="inline-flex items-center gap-2 text-xl text-principle"
          >
            <Icon icon="lets-icons:refund-back" />
            {copy?.detail?.back}
          </Link>
        </div>

        {/* HERO */}
        <section className="grid grid-cols-1 gap-8 lg:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <span className="inline-flex max-w-max rounded-full bg-[#CE9486]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9573c]">
              {category}
            </span>

            <MaskText>
              <h1 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-bold leading-none text-principle">
                {title}
              </h1>
            </MaskText>

            <p className="max-w-3xl text-base leading-7 text-para lg:text-lg">
              {excerpt}
            </p>
          </div>

          <div className="relative h-[380px] overflow-hidden rounded-md lg:h-[620px]">
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
        <section className="grid grid-cols-1 gap-8  py-16  lg:px-10 xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="space-y-8">
            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.infoTitle}
              </p>

              <div className="space-y-4 text-base leading-8 text-para lg:text-lg">
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>

            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.includedTitle}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {included.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-[#fff8f4] p-5 text-md text-para"
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
            <article className="rounded-md bg-[#2c395b] p-6 text-[#fef3ea] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fef3ea]/60">
                {copy?.detail?.nextDates}
              </p>

              <h2 className="mb-5 text-3xl font-bold text-white">
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

              <div className="space-y-3">
                {event.dates?.map((date) => {
                  const label = lang === "en" ? date.labelEn : date.labelIt;
                  const stripeEnabled =
                    Boolean(date?.stripe?.enabled) &&
                    Number(date?.stripe?.priceCents) > 0;
                  const bookingState = getDateBookingState(date.iso);
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
                  const checkoutPriceLabel = stripeEnabled
                    ? new Intl.NumberFormat(lang === "en" ? "en-US" : "it-IT", {
                        style: "currency",
                        currency: String(date.stripe.currency || "eur").toUpperCase(),
                      }).format(unitPriceCents / 100)
                    : "";
                  const checkoutTotalPriceLabel = stripeEnabled
                    ? new Intl.NumberFormat(lang === "en" ? "en-US" : "it-IT", {
                        style: "currency",
                        currency: String(date.stripe.currency || "eur").toUpperCase(),
                      }).format(totalPriceCents / 100)
                    : "";

                  return (
                    <div
                      key={date.iso}
                      className="p-4 border rounded-md border-white/10 bg-white/5"
                    >
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-sm text-[#fef3ea]/75">{date.time}</p>
                      {stripeEnabled ? (
                        <div className="mt-3">
                          <p className="mb-2 text-xs text-[#fef3ea]/75">
                            {lang === "en" ? "Online payment" : "Pagamento online"}:{" "}
                            <strong className="text-white">{checkoutPriceLabel}</strong>
                          </p>
                          <div className="mb-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateDateQuantity(date.iso, quantity - 1, maxQuantity)
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10"
                            >
                              -
                            </button>
                            <span className="min-w-[36px] text-center text-sm font-semibold text-white">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateDateQuantity(date.iso, quantity + 1, maxQuantity)
                              }
                              disabled={quantity >= maxQuantity}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10"
                            >
                              +
                            </button>
                            <span className="ml-2 text-xs text-[#fef3ea]/75">
                              {lang === "en" ? "Total" : "Totale"}:{" "}
                              <strong className="text-white">
                                {checkoutTotalPriceLabel}
                              </strong>
                            </span>
                          </div>

                          <div className="mb-3 space-y-2">
                            {Array.from({ length: quantity }).map((_, index) => (
                              <input
                                key={`${date.iso}-attendee-${index}`}
                                type="text"
                                value={bookingState.attendeeNames?.[index] || ""}
                                onChange={(event) =>
                                  updateAttendeeName(
                                    date.iso,
                                    index,
                                    event.target.value,
                                  )
                                }
                                placeholder={
                                  lang === "en"
                                    ? `Participant ${index + 1} name`
                                    : `Nome partecipante ${index + 1}`
                                }
                                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-[#fef3ea]/60 outline-none focus:border-white/40"
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => startStripeCheckout(date)}
                            disabled={checkoutDateIso === date.iso}
                            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Icon icon="hugeicons:credit-card" width="14" height="14" />
                            {checkoutDateIso === date.iso
                              ? checkoutLoadingLabel
                              : checkoutLabel}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

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
                {event.gallery ? (
                  event.gallery.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className={`relative overflow-hidden rounded-md ${
                        index === 0 ? "sm:col-span-2 h-[260px]" : "h-[180px]"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${event.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-para">{copy.detail.noGallery}</p>
                )}
              </div>
            </article>
          </div>
        </section>
      </div>
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
