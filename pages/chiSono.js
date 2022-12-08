import React from "react";
import dynamic from "next/dynamic";
const DynamicHeroChiSono = dynamic(() =>
  import("../components/chiSono/heroChiSono")
);
const DynamicText = dynamic(() => import("../components/chiSono/text"));
const DynamicBgImage = dynamic(() => import("../components/chiSono/bgImage"));
const DynamicAboutGallery = dynamic(() =>
  import("../components/chiSono/aboutGallery")
);
const DynamicBanner = dynamic(() => import("../components/sectionFive/banner"));
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";

const ChiSono = ({ translation }) => {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{translation?.who?.head?.title}</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicHeroChiSono translation={translation?.who?.hero} />
      <DynamicText translation={translation?.who?.hero} />
      <DynamicBgImage translation={translation?.who?.hero} />
      <DynamicAboutGallery translation={translation?.who} />
      <DynamicBanner translation={translation?.home?.banner} />
    </>
  );
};

export default ChiSono;

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
