import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicHero = dynamic(() => import("../components/layout/hero"));
const DynamicMission = dynamic(
  () => import("../components/sectionOne/mission"),
);
const DynamicAboutMe = dynamic(
  () => import("../components/sectionThree/aboutMe"),
);
const DynamicEvents = dynamic(() => import("../components/sectionSix/events"));
const DynamicMap = dynamic(() => import("../components/sectionTwo/map"));
const DynamicInsta = dynamic(() => import("../components/sectionFour/insta"));
const DynamicBanner = dynamic(() => import("../components/sectionFive/banner"));
import BgAnimation from "../components/bgAnimation/bgAnimation";

import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";
import BlogSection from "../components/blogSection/blogSection";
import {
  getPosts,
  getCategories,
  getMedia,
  getTagId,
} from "../utils/wordpress";
import { getAllEvents } from "../utils/events";
import MapCards from "../components/MapCards/MapCards";
import { MaskText } from "../components/UI/MaskText";
import ElfsightWidget from "../components/UI/ElfsightWidget";
import CtaPrimary from "../components/button/CtaPrimary";
import CtaOutline from "../components/button/CtaOutline";

function buildHomeAppointments(events = []) {
  const flatDates = (events || [])
    .flatMap((event) =>
      (event.dates || []).map((date) => ({
        id: `${event.slug}-${date.iso}`,
        slug: event.slug,
        title: event.title,
        category: event.category,
        location: event.location,
        price: event.price,
        dateLabel: date.label || date.labelIt || date.labelEn || "",
        time: date.time || "",
        spots: Number(date.spots) || 0,
        iso: date.iso || "",
      })),
    )
    .filter((item) => item.iso)
    .sort((left, right) => left.iso.localeCompare(right.iso));

  const firstMonth = flatDates[0]?.iso?.slice(5, 7);
  const source = firstMonth
    ? flatDates.filter((item) => item.iso.slice(5, 7) === firstMonth)
    : flatDates;

  return source.slice(0, 6);
}

export default function Home({ translation, post, tours, homeAppointments }) {
  const { locale } = useRouter();
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.head?.description} />
        <meta name="keywords" content={translation?.head?.keywords} />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={translation?.head?.title} />
        <meta
          property="og:description"
          content={translation?.head?.description}
        />

        <meta
          property="og:image"
          content="https://luisaquaglia-tourguide.com/assets/og-img.png"
        />
        <meta property="og:site_name" content="Lou On Tour" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="luisaquaglia-tourguide.com" />
        <meta
          property="twitter:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta name="twitter:title" content={translation?.head?.title} />
        <meta
          name="twitter:description"
          content={translation?.head?.description}
        />
        <meta
          name="twitter:image"
          content="https://luisaquaglia-tourguide.com/assets/og-img.png"
        />
        <meta
          name="google-site-verification"
          content="VugQRoR3pOE9GDvlxY_wCpj-2XvR1kXk"
        />
      </Head>

      <DynamicHero translation={translation?.hero} />

      <div className="min-h-screen pt-20 ">
        <div className="flex flex-col w-full px-4 mx-auto my-10 lg:items-center lg:justify-center lg:text-center 2xl:w-3/5">
          <h2 className="text-base lg:text-xl font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.map?.subTitle}
          </h2>
          <MaskText>
            <h2 className="text-3xl md:text-5xl 3xl:text-[100px] font-bold mt-3 3xl:mt-12 3xl:leading-[5.5rem] ">
              {translation?.map?.title}
            </h2>
          </MaskText>
          <p className="mx-auto mt-4 mb-8 text-base text-para xl:max-w-4xl 2xl:text-lg 3xl:text-3xl lg:mt-8 3xl:mt-20">
            {translation?.map?.paragraph}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:max-w-max">
            <CtaPrimary link="mailto:luisaquaglia.tourguide@gmail.com">
              {translation?.map?.button}
            </CtaPrimary>
            <CtaOutline link="/tours-da-fare">
              {translation?.map?.tourcta}
            </CtaOutline>
          </div>
        </div>
        <MapCards translation={tours} />
      </div>

      <DynamicAboutMe translation={translation?.about} />
      <DynamicEvents
        translation={translation?.events}
        appointments={homeAppointments || []}
        locale={locale || "it"}
      />
      <ElfsightWidget />

      <BlogSection post={post} translation={translation?.blogSection} />
      <DynamicBanner translation={translation?.banner} />
    </>
  );
}
export async function getStaticProps({ locale }) {
  const lang = locale || "it";
  const idLocale = await getTagId(locale); // recupera id della lingua attuale
  const post = await getPosts(idLocale); //recupera post nella lingua attuale
  const category = await getCategories();
  const media = await getMedia();
  const events = await getAllEvents(lang);

  let obj;

  switch (locale) {
    case "it":
      obj = translationIT;
      break;

    case "en":
      obj = translationEN;
      break;
    default:
      obj = translationIT;
      break;
  }

  return {
    props: {
      translation: obj?.home,
      homeAppointments: buildHomeAppointments(events),
      tours: obj?.tours,
      post: post.sort((a, b) => a?.date > b?.date).filter((el, i) => i < 3),
      category: category,
      media: media,
    },
    revalidate: 60,
  };
}
