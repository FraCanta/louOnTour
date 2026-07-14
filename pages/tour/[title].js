import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MaskText } from "../../components/UI/MaskText";
import Banner from "../../components/sectionFive/banner";
import TourGalleryLightbox from "../../components/TourGalleryLightbox";
import translationIT from "../../public/locales/it/it.json";
import translationEN from "../../public/locales/en/en.json";
import { getAllTours, getTourBySlug } from "../../utils/tours";

function plainText(value = "") {
  return String(value).replace(/<[^>]*>/g, "").trim();
}

async function getGalleryImageMetadata(src) {
  if (!src || !String(src).startsWith("/")) {
    return { src, width: 1600, height: 1067 };
  }

  try {
    const path = require("path");
    const sharp = require("sharp");
    const publicDir = path.join(process.cwd(), "public");
    const imagePath = path.join(publicDir, String(src).replace(/^\/+/, ""));
    const resolvedPath = path.resolve(imagePath);

    if (!resolvedPath.startsWith(path.resolve(publicDir))) {
      return { src, width: 1600, height: 1067 };
    }

    const metadata = await sharp(resolvedPath).metadata();

    return {
      src,
      width: metadata.width || 1600,
      height: metadata.height || 1067,
    };
  } catch (_error) {
    return { src, width: 1600, height: 1067 };
  }
}

async function buildGalleryImages(images = []) {
  return Promise.all(images.map((image) => getGalleryImageMetadata(image)));
}

export default function TourDetailPage({ city, databaseTour, locale, banner, gallery }) {
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
  const galleryImages = gallery || [];

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
            <article className="rounded-md border border-[#c9573c]/10 bg-white p-6 shadow-[0_18px_45px_rgba(35,47,55,0.05)] lg:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9573c]/70">
                {lang === "en" ? "Gallery" : "Galleria"}
              </p>
              <TourGalleryLightbox images={galleryImages} title={title} locale={lang} />
            </article>
          </div>
        </section>
      </div>
      <Banner translation={banner} />
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

  const gallerySources = databaseTour?.gallery?.length
    ? databaseTour.gallery
    : (city?.tourItem || []).map((item) => item.img).filter(Boolean);
  const gallery = await buildGalleryImages(gallerySources);

  return {
    props: {
      city: city || {},
      databaseTour,
      locale: lang,
      banner: translations?.tours?.banner || null,
      gallery,
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
