import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import { getAllEvents, getEventsPageCopy } from "../../utils/events";
import Banner from "../../components/sectionFive/banner";

const MONTH_RANGE = [6, 7, 8, 9, 10, 11];

function getMonthFromIso(iso = "") {
  const month = Number(String(iso).slice(5, 7));
  return Number.isNaN(month) ? 0 : month;
}

function getMonthLabel(month, locale = "it") {
  const monthDate = new Date(Date.UTC(2026, month - 1, 1, 12, 0, 0));
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "it-IT", {
    month: "long",
    timeZone: "Europe/Rome",
  }).format(monthDate);
}

export default function EventsPage({ copy, events, featuredEvent }) {
  const categories = events?.length
    ? [...new Set(events.map((event) => event.category))]
    : [];

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const firstMonth = getMonthFromIso(events?.[0]?.dates?.[0]?.iso);
    return MONTH_RANGE.includes(firstMonth) ? firstMonth : MONTH_RANGE[0];
  });

  const monthOptions = useMemo(
    () =>
      MONTH_RANGE.map((month) => {
        const hasEvents = events.some((event) =>
          (event.dates || []).some(
            (date) => getMonthFromIso(date.iso) === month,
          ),
        );

        return {
          month,
          label: getMonthLabel(month, copy?.locale || "it"),
          hasEvents,
        };
      }),
    [copy?.locale, events],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        (event.dates || []).some(
          (date) => getMonthFromIso(date.iso) === selectedMonth,
        ),
      ),
    [events, selectedMonth],
  );

  const noDatesLabel =
    copy?.locale === "en"
      ? "No dates published yet for this month."
      : "Per questo mese non ci sono ancora date pubblicate.";
  const noDatesHint =
    copy?.locale === "en"
      ? "I am updating the calendar continuously. Check back soon."
      : "Sto aggiornando il calendario in modo continuo. Torna presto.";
  const groupSizeLabel =
    copy?.locale === "en" ? "Min 4 - Max 10" : "Min 4 - Max 10";

  return (
    <>
      <Head>
        <title>{copy.page.title}</title>
        <meta name="description" content={copy.page.description} />
        <meta property="og:title" content={`${copy.page.title}`} />
        <meta property="og:description" content={copy.page.description} />
      </Head>

      <div className="w-11/12 qhd:max-w-[2304px] pb-20 qhd:pb-32 mx-auto">
        <section className="py-10 lg:px-10 qhd:px-0 lg:py-16 qhd:py-24">
          <div className="grid items-end grid-cols-1 gap-8 qhd:gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-4 qhd:gap-7">
              <h1 className="text-sm lg:text-base qhd:text-xl font-semibold px-3 lg:px-4 qhd:px-5 py-2 qhd:py-3 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
                {copy.page.eyebrow}
              </h1>

              <MaskText>
                <h2 className="text-3xl md:text-[3.8rem] qhd:text-[5rem] font-bold leading-tight md:leading-none max-w-5xl qhd:max-w-7xl text-principle">
                  {copy.page.heading}
                </h2>
              </MaskText>

              <p className="max-w-3xl text-base leading-7 qhd:max-w-5xl text-para lg:text-lg qhd:text-2xl qhd:leading-10">
                {copy.page.paragraph}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#77674E] shadow-[0_12px_30px_rgba(35,47,55,0.05)]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {featuredEvent && (
              <article className="overflow-hidden rounded-md border border-[#c9573c]/10 bg-white shadow-[0_20px_50px_rgba(35,47,55,0.06)]">
                {" "}
                <div className="relative h-[320px] qhd:h-[430px]">
                  <Image
                    src={featuredEvent.heroImage}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,57,91,0.05)_0%,rgba(44,57,91,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fef3ea]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]">
                      <Icon
                        icon="hugeicons:calendar-03"
                        width="14"
                        height="14"
                      />
                      {copy.page.featured}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold text-white qhd:text-5xl">
                      {featuredEvent.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 qhd:text-xl qhd:leading-8 text-white/90">
                      {featuredEvent.excerpt}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9573c]/70">
                      {copy.page.locationLabel}
                    </p>
                    <p className="font-semibold text-principle">
                      {featuredEvent.location}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9573c]/70">
                      {copy.page.durationLabel}
                    </p>
                    <p className="font-semibold text-principle">
                      {featuredEvent.duration}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c9573c]/70">
                      {copy.page.fromLabel}
                    </p>
                    <p className="font-semibold text-principle">
                      {featuredEvent.price}
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section className="lg:px-10 qhd:px-0">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.page.allEvents}
              </p>
              <h2 className="text-4xl font-bold qhd:text-6xl text-principle">
                {copy.page.upcoming}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {monthOptions.map((option) => (
              <button
                key={option.month}
                type="button"
                onClick={() => setSelectedMonth(option.month)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  option.month === selectedMonth
                    ? "bg-[#77674E] text-white"
                    : "bg-white text-[#77674E] border border-[#c9573c]/15"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {events.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-principle">
                {copy.page.noEventsTitle}
              </p>
              <p className="mt-2 text-para">{copy.page.noEventsText}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-20 text-center rounded-md border border-[#c9573c]/10 bg-white">
              <p className="text-lg font-semibold text-principle">
                {noDatesLabel}
              </p>
              <p className="mt-2 text-sm text-[#6d7b80]">{noDatesHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 qhd:gap-8 xl:grid-cols-3 lg:grid-cols-2">
              {filteredEvents.map((event) => {
                const monthDate = (event.dates || []).find(
                  (date) => getMonthFromIso(date.iso) === selectedMonth,
                );

                return (
                  <article
                    key={`${event.slug}-${selectedMonth}`}
                    className="overflow-hidden rounded-md border border-[#c9573c]/10 bg-white shadow-[0_18px_45px_rgba(35,47,55,0.05)]"
                  >
                    <div className="relative h-[280px] qhd:h-[380px]">
                      <Image
                        src={event.heroImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="p-6 qhd:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="rounded-full bg-[#CE9486]/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]">
                          {event.category}
                        </span>
                        <span className="rounded-full bg-[#fff8f4] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#77674E]">
                          {monthDate?.label || event.dates[0]?.label}
                        </span>
                      </div>

                      <h3 className="mb-3 text-3xl font-bold qhd:text-5xl text-principle">
                        {event.title}
                      </h3>
                      <p className="mb-5 text-sm leading-6 qhd:text-xl qhd:leading-8 text-para">
                        {event.excerpt}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                        <div className="rounded-md bg-[#fff8f4] p-3">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                            {copy.page.locationLabel}
                          </p>
                          <p className="font-semibold text-principle">
                            {event.location}
                          </p>
                        </div>
                        <div className="rounded-md bg-[#fff8f4] p-3">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                            {copy.page.durationLabel}
                          </p>
                          <p className="font-semibold text-principle">
                            {event.duration}
                          </p>
                        </div>
                        <div className="rounded-md bg-[#fff8f4] p-3">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                            {copy.page.fromLabel}
                          </p>
                          <p className="font-semibold text-principle">
                            {event.price}
                          </p>
                        </div>
                        <div className="rounded-md bg-[#fff8f4] p-3">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                            {copy.page.spotsLabel}
                          </p>
                          <p className="font-semibold text-principle">
                            {monthDate?.spots ?? event.dates[0]?.spots}
                          </p>
                          <p className="mt-1 text-[11px] text-[#6d7b80]">
                            {groupSizeLabel}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/eventi/${event.slug}`}
                        className="inline-flex items-center gap-2 font-semibold text-[#c9573c] underline underline-offset-4"
                      >
                        {copy.page.discoverCta}
                        <Icon
                          icon="lets-icons:arrow-right-light"
                          width="18"
                          height="18"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
      <Banner translation={copy.page.banner} />
    </>
  );
}

export async function getStaticProps({ locale }) {
  const lang = locale || "it";
  const copy = await getEventsPageCopy(lang);
  const events = await getAllEvents(lang);
  const copyWithLocale = {
    ...copy,
    locale: lang,
  };

  return {
    props: {
      copy: copyWithLocale,
      events,
      featuredEvent: events.length > 0 ? events[0] : null,
    },
    revalidate: 60,
  };
}
