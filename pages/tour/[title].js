import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import TourBookingBox from "../../components/TourBookingBox";
import translationIT from "../../public/locales/it/it.json";
import translationEN from "../../public/locales/en/en.json";
import { getAllTours, getTourBySlug } from "../../utils/tours";

function plainText(value = "") {
  return String(value).replace(/<[^>]*>/g, "").trim();
}

export default function TourDetailPage({ city, databaseTour, locale }) {
  if (!city) return null;

  const lang = locale === "en" ? "en" : "it";
  const title = databaseTour?.title || plainText(city.titleImg || city.title);
  const location = databaseTour?.location || city.name || city.title;
  const excerpt = databaseTour?.excerpt || city.descrizione2 || "";
  const heroImage = databaseTour?.heroImage || city.img;
  const description = databaseTour?.description?.length
    ? databaseTour.description
    : (city.descrizione || []).map((item) => item.p).filter(Boolean);
  const included = databaseTour?.included?.length
    ? databaseTour.included
    : (city.list || []).map((item) => item?.l?.title).filter(Boolean);
  const gallery = databaseTour?.gallery?.length
    ? databaseTour.gallery
    : (city.tourItem || []).map((item) => item.img).filter(Boolean);

  return (
    <>
      <Head>
        <title>Luisa Quaglia Tour Guide | {title}</title>
        <meta name="description" content={plainText(excerpt)} />
        <meta property="og:title" content={`Luisa Quaglia Tour Guide | ${title}`} />
        <meta property="og:description" content={plainText(excerpt)} />
        <meta property="og:image" content={heroImage} />
      </Head>

      <div className="w-11/12 qhd:max-w-[2304px] pb-20 qhd:pb-32 mx-auto">
        <div className="mt-10 mb-8 qhd:mt-14 lg:px-10 qhd:px-0">
          <Link
            href="/tours-da-fare"
            className="inline-flex items-center gap-2 text-xl qhd:text-3xl text-principle"
          >
            <Icon icon="lets-icons:refund-back" />
            {city.cta || (lang === "en" ? "Back to tours" : "Torna ai tour")}
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-8 qhd:gap-16 lg:px-10 qhd:px-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-4 qhd:gap-7">
            <span className="inline-flex max-w-max rounded-full bg-[#CE9486]/20 px-4 qhd:px-5 py-2 qhd:py-3 text-xs qhd:text-lg font-semibold uppercase tracking-[0.24em] text-[#c9573c]">
              {location}
            </span>
            <MaskText>
              <h1 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] qhd:text-[6.6rem] font-bold leading-none text-principle">
                {title}
              </h1>
            </MaskText>
            <p
              className="max-w-3xl text-base leading-7 qhd:max-w-5xl text-para lg:text-lg qhd:text-2xl qhd:leading-10"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
            {databaseTour ? (
              <a
                href="#prenotazione"
                className="md:hidden inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2c395b] px-6 py-3 font-semibold text-white"
              >
                {lang === "en" ? "Book now" : "Prenota ora"}
                <Icon icon="hugeicons:calendar-check-out-02" width="18" height="18" />
              </a>
            ) : null}
          </div>

          <div className="relative h-[380px] overflow-hidden rounded-md lg:h-[620px] qhd:h-[826px]">
            <Image src={heroImage} alt={title} fill priority className="object-cover" />
          </div>
        </section>

        {city.citazione ? (
          <section className="mx-auto max-w-7xl py-12 text-center lg:py-20 qhd:max-w-[1800px] qhd:py-28">
            <blockquote className="text-xl italic leading-snug text-para/50 lg:text-5xl qhd:text-6xl qhd:leading-tight">
              {city.citazione}
            </blockquote>
          </section>
        ) : null}

        <section className="grid grid-cols-1 gap-8 qhd:gap-14 pb-16 qhd:pb-24 lg:px-10 qhd:px-0 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8 qhd:p-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {lang === "en" ? "About the tour" : "Il tour"}
              </p>
              <div className="space-y-4 text-base leading-8 text-para lg:text-lg qhd:space-y-6 qhd:text-2xl qhd:leading-10">
                {description.map((paragraph, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </article>

            {included.length ? (
              <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 lg:p-8 qhd:p-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                  {lang === "en" ? "What we will discover" : "Cosa scopriremo"}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {included.map((item, index) => (
                    <div key={index} className="rounded-md bg-[#fff8f4] p-5 text-para qhd:p-7 qhd:text-xl qhd:leading-8">
                      <Icon icon="hugeicons:checkmark-badge-01" className="mb-3" />
                      <p dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </div>

          <div className="space-y-8">
            {databaseTour ? <TourBookingBox tour={databaseTour} locale={lang} /> : null}

            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {lang === "en" ? "Gallery" : "Galleria"}
              </p>
              {gallery.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {gallery.slice(0, 5).map((image, index) => (
                    <div key={`${image}-${index}`} className={`relative overflow-hidden rounded-md ${index === 0 ? "h-[260px] sm:col-span-2" : "h-[180px]"}`}>
                      <Image src={image} alt={`${title} ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-para">
                  {lang === "en" ? "No images available." : "Nessuna immagine disponibile."}
                </p>
              )}
            </article>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({ params, locale = "it" }) {
  const lang = locale === "en" ? "en" : "it";
  const translations = lang === "en" ? translationEN : translationIT;
  const city = translations?.tours?.locationTours?.[params.title] || null;
  let databaseTour = null;

  try {
    databaseTour = await getTourBySlug(params.title, lang);
  } catch (_error) {
    databaseTour = null;
  }

  if (!city && !databaseTour) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      city: city || {},
      databaseTour,
      locale: lang,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const legacySlugs = new Set([
    ...Object.keys(translationIT?.tours?.locationTours || {}),
    ...Object.keys(translationEN?.tours?.locationTours || {}),
  ]);

  try {
    const tours = await getAllTours("it");
    tours.forEach((tour) => legacySlugs.add(tour.slug));
  } catch (_error) {}

  return {
    paths: ["it", "en"].flatMap((locale) =>
      [...legacySlugs].map((title) => ({ params: { title }, locale })),
    ),
    fallback: "blocking",
  };
}
