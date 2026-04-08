import React from "react";
import Subscribe from "../components/newsletter/subscribe";
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import Banner from "../components/sectionFive/banner";

const Newsletter = ({ translation, banner }) => {
  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.paragrafo} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-4 lg:min-h-[calc(50vh_-_100px)] flex justify-center items-center newsletter ">
        <Subscribe translation={translation} />
      </div>
      <Banner translation={translation.banner} />
    </>
  );
};

export default Newsletter;

export async function getStaticProps({ locale }) {
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
      translation: obj?.newsletter,
    },
    revalidate: 60,
  };
}
