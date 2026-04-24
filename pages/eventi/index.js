import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import CtaPrimary from "../../components/button/CtaPrimary";
import CtaOutline from "../../components/button/CtaOutline";
import { getAllEvents, getEventsPageCopy } from "../../utils/events";

export default function EventsPage({ copy, events, featuredEvent }) {
  const categories = events?.length
    ? [...new Set(events.map((event) => event.category))]
    : [];
  return (
    <>
      <Head>
        <title>{copy.page.title}</title>
        <meta name="description" content={copy.page.description} />
        <meta property="og:title" content={copy.page.title} />
        <meta property="og:description" content={copy.page.description} />
      </Head>

      <div className="pb-20">
        <section className="w-11/12 px-4 py-10 mx-auto lg:px-10 lg:py-16">
          <div className="grid items-end grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-4">
              <h1 className="text-sm lg:text-base font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
                {copy.page.eyebrow}
              </h1>

              <MaskText>
                <h2 className="text-[2.5rem] md:text-[3.8rem] xl:text-[5rem] font-bold leading-none max-w-5xl text-principle">
                  {copy.page.heading}
                </h2>
              </MaskText>

              <p className="max-w-3xl text-base leading-7 text-para lg:text-lg">
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
              <article className="overflow-hidden rounded-[2rem] border border-[#c9573c]/10 bg-white shadow-[0_20px_50px_rgba(35,47,55,0.06)]">
                {" "}
                <div className="relative h-[320px]">
                  <Image
                    src={featuredEvent.heroImage}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                    priority
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
                    <h2 className="mt-4 text-3xl font-bold text-white">
                      {featuredEvent.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/85">
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

        <section className="w-11/12 px-4 mx-auto lg:px-10">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.page.allEvents}
              </p>
              <h2 className="text-4xl font-bold text-principle">
                {copy.page.upcoming}
              </h2>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-principle">
                {copy.page.noEventsTitle}
              </p>
              <p className="mt-2 text-para">{copy.page.noEventsText}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 lg:grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.slug}
                  className="overflow-hidden rounded-[2rem] border border-[#c9573c]/10 bg-white shadow-[0_18px_45px_rgba(35,47,55,0.05)]"
                >
                  <div className="relative h-[280px]">
                    <Image
                      src={event.heroImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="rounded-full bg-[#CE9486]/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9573c]">
                        {event.category}
                      </span>
                      <span className="rounded-full bg-[#fff8f4] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#77674E]">
                        {event.dates[0]?.label}
                      </span>
                    </div>

                    <h3 className="mb-3 text-3xl font-bold text-principle">
                      {event.title}
                    </h3>
                    <p className="mb-5 text-sm leading-6 text-para">
                      {event.excerpt}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                      <div className="rounded-2xl bg-[#fff8f4] p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                          {copy.page.locationLabel}
                        </p>
                        <p className="font-semibold text-principle">
                          {event.location}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff8f4] p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                          {copy.page.durationLabel}
                        </p>
                        <p className="font-semibold text-principle">
                          {event.duration}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff8f4] p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                          {copy.page.fromLabel}
                        </p>
                        <p className="font-semibold text-principle">
                          {event.price}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff8f4] p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                          {copy.page.spotsLabel}
                        </p>
                        <p className="font-semibold text-principle">
                          {event.dates[0]?.spots}
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
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const lang = locale || "it";
  const copy = await getEventsPageCopy(lang);
  const events = await getAllEvents(lang);

  return {
    props: {
      copy,
      events,
      featuredEvent: events.length > 0 ? events[0] : null,
    },
    revalidate: 60,
  };
}
