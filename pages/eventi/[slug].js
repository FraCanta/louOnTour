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

export default function EventDetailPage({ event, copy, locale }) {
  const lang = locale === "en" ? "en" : "it";
  if (!event) return null;

  // 🔹 DB (solo contenuti evento)
  const title = event.title;
  const excerpt = event.excerpt;
  const category = event.category;
  const duration = event.duration;
  const price = event.price;
  const languages = event.languages;
  const meetingPoint = event.meetingPoint;
  const recurring = event.recurring;

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

      <div className="pb-20">
        {/* BACK */}
        <div className="w-11/12 px-4 mx-auto mt-10 mb-8 lg:px-10">
          <Link
            href="/eventi"
            className="inline-flex items-center gap-2 text-xl text-principle"
          >
            <Icon icon="lets-icons:refund-back" />
            {copy?.detail?.back}
          </Link>
        </div>

        {/* HERO */}
        <section className="grid w-11/12 grid-cols-1 gap-8 px-4 mx-auto lg:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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

          <div className="relative h-[380px] overflow-hidden rounded-[2rem] lg:h-[620px]">
            <Image
              src={event.heroImage}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </section>

        {/* CONTENT */}
        <section className="grid w-11/12 grid-cols-1 gap-8 px-4 py-16 mx-auto lg:px-10 xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="space-y-8">
            <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white p-6 lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.infoTitle}
              </p>

              <div className="space-y-4 text-base leading-8 text-para lg:text-lg">
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#c9573c]/10 bg-white p-6 lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {copy?.detail?.includedTitle}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {included.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-[1.5rem] bg-[#fff8f4] p-5 text-sm"
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
            <article className="rounded-[2rem] bg-[#2c395b] p-6 text-[#fef3ea] lg:p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fef3ea]/60">
                {copy?.detail?.nextDates}
              </p>

              <h2 className="mb-5 text-3xl font-bold text-white">
                {recurring}
              </h2>

              <div className="space-y-3">
                {event.dates?.map((date) => {
                  const label = lang === "en" ? date.labelEn : date.labelIt;

                  return (
                    <div
                      key={date.iso}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-sm text-[#fef3ea]/75">{date.time}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-[1.5rem] bg-white/5 p-4">
                  <p className="text-xs uppercase text-[#fef3ea]/60">
                    {copy?.detail?.meetingPoint}
                  </p>
                  <p className="text-sm">{meetingPoint}</p>
                </div>

                <CtaPrimary
                  link={`mailto:luisaquaglia.tourguide@gmail.com?subject=${subject}`}
                  className="!w-full"
                >
                  {copy?.detail?.contactCta}
                </CtaPrimary>
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
