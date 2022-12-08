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

const ChiSono = ({ translation, home }) => {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicHeroChiSono translation={translation?.hero} />
      <DynamicText translation={translation?.hero} />
      <DynamicBgImage translation={translation?.hero} />
      <DynamicAboutGallery translation={translation} />
      <DynamicBanner translation={home?.banner} />
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
      translation: obj?.who,
      home: obj?.home,
    },
    revalidate: 60,
  };
}
