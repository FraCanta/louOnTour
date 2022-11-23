import React from "react";
import HeroChiSono from "../components/chiSono/heroChiSono";
import Head from "next/head";
import Text from "../components/chiSono/text";
import BgImage from "../components/chiSono/bgImage";
import AboutGallery from "../components/chiSono/aboutGallery";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";

const ChiSono = ({ translation }) => {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>Lou On Tour - Chi Sono</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroChiSono />
      <Text />
      <BgImage />
      <AboutGallery aboutme={translation?.about?.galleria} />
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
