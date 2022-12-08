import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicHero = dynamic(() => import("../components/layout/hero"));
const DynamicMission = dynamic(() =>
  import("../components/sectionOne/mission")
);
const DynamicAboutMe = dynamic(() =>
  import("../components/sectionThree/aboutMe")
);
const DynamicMap = dynamic(() => import("../components/sectionTwo/map"));
const DynamicInsta = dynamic(() => import("../components/sectionFour/insta"));
const DynamicBanner = dynamic(() => import("../components/sectionFive/banner"));

import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";
export default function Home({ translation }) {
  const { locale } = useRouter();
  return (
    <div>
      <Head>
        <title>{translation?.home?.head?.title}</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicHero translation={translation?.home?.hero} />
      <DynamicMission translation={translation?.home?.mission} />
      <DynamicMap translation={translation?.home?.map} />
      <DynamicAboutMe translation={translation?.home?.about} />
      <DynamicInsta translation={translation?.home?.socialLou} />
      <DynamicBanner translation={translation?.home?.banner} />
    </div>
  );
}
export async function getStaticProps(locale) {
  let obj;
  switch (locale.locale) {
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
      translation: obj,
    },
    revalidate: 60,
  };
}
