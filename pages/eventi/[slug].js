import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import CtaPrimary from "../../components/button/CtaPrimary";
import CtaOutline from "../../components/button/CtaOutline";
import {
  getEventBySlug,
  getEventsPageCopy,
  getEventSlugs,
} from "../../utils/events";

export default function EventDetailPage({ event, copy }) {
  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.excerpt} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.excerpt} />
        <meta property="og:image" content={event.heroImage} />
      </Head>

      <div className="pb-20">
        <div className="w-11/12 px-4 mx-auto mt-10 mb-8 lg:px-10">
          <Link
            href="/eventi"
            className="inline-flex items-center gap-2 text-xl text-principle"
          >
            <Icon icon="lets-icons:refund-back" /> {copy.detail.back}
          </Link>
        </div>

        <section className="grid w-11/12 grid-cols-1 gap-8 px-4 mx-auto lg:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <span className="inline-flex max-w-max rounded-full bg-[#CE9486]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9573c]">
              {event.category}
            </span>

            <MaskText>
              <h1 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-bold leading-none text-principle">
                {event.title}
              </h1>
            </MaskText>

            <p className="max-w-3xl text-base leading-7 text-para lg:text-lg">
              {event.excerpt}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
              {[
                {
                  label: copy.detail.category,
                  value: event.category,
                  icon: "hugeicons:layers-01",
                },
                {
                  label: copy.detail.duration,
                  value: event.duration,
                  icon: "hugeicons:clock-01",
                },
                {
                  label: copy.detail.price,
                  value: event.price,
                  icon: "hugeicons:wallet-02",
                },
                {
                  label: copy.detail.languages,
                  value: event.languages,
                  icon: "hugeicons:language-circle",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-[#c9573c]/10 bg-white p-4 shadow-[0_14px_35px_rgba(35,47,55,0.04)]"
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#CE9486]/20 text-[#c9573c]">
                    <Icon icon={item.icon} width="18" height="18" />
                  </span>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9573c]/70">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold leading-6 text-principle">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[380px] overflow-hidden rounded-[2rem] lg:h-[620px]">
            <Image
              src={event.heroImage}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </section>

        <section className="grid w-11/12 grid-cols-1 gap-8 px-4 py-16 mx-auto lg:px-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.detail.infoTitle}
              </p>
              <div className="space-y-4 text-base leading-8 text-para lg:text-lg">
                {event.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.detail.includedTitle}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {event.included.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] bg-[#fff8f4] p-5 text-sm leading-7 text-para"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#CE9486]/20 text-[#c9573c]">
                      <Icon
                        icon="hugeicons:checkmark-badge-01"
                        width="18"
                        height="18"
                      />
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-8">
            <article className="rounded-[2rem] bg-[#2c395b] p-6 text-[#fef3ea] shadow-[0_24px_60px_rgba(44,57,91,0.18)] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fef3ea]/60">
                {copy.detail.nextDates}
              </p>
              <h2 className="mb-5 text-3xl font-bold text-white">
                {event.recurring}
              </h2>

              <div className="space-y-3">
                {event.dates.map((date) => (
                  <div
                    key={date.iso}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{date.label}</p>
                        <p className="text-sm text-[#fef3ea]/75">{date.time}</p>
                      </div>
                      <span className="rounded-full bg-[#fef3ea]/10 px-3 py-2 text-xs font-semibold text-[#fef3ea]">
                        {date.spots} posti
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 mt-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fef3ea]/60">
                    {copy.detail.meetingPoint}
                  </p>
                  <p className="text-sm leading-6 text-[#fef3ea]/85">
                    {event.meetingPoint}
                  </p>
                </div>
                <CtaPrimary link="/contatti" className="!w-full">
                  {copy.detail.contactCta}
                </CtaPrimary>
                <CtaOutline
                  link="/newsletter"
                  className="!w-full !border-[#fef3ea]/30 !text-[#fef3ea]"
                >
                  {copy.detail.newsletterCta}
                </CtaOutline>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy.detail.galleryTitle}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {event.gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`relative overflow-hidden rounded-[1.5rem] ${
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
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({ params, locale }) {
  const lang = locale || "it";
  const event = await getEventBySlug(params.slug, lang);
  const copy = await getEventsPageCopy(lang);

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
      copy,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const slugs = await getEventSlugs();
  const locales = ["it", "en"];

  const paths = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      params: { slug },
      locale,
    })),
  );

  return {
    paths,
    fallback: false,
  };
}
