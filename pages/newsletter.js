import React from "react";
import Head from "next/head";
import Subscribe from "../components/newsletter/subscribe";
import Banner from "../components/sectionFive/banner";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

const Newsletter = ({ translation }) => {
  return (
    <>
      <Head>
        <title>{translation.title}</title>
        <meta name="description" content={translation.paragrafo} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="newsletter flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-16">
        <Subscribe translation={translation} variant="page" />
      </section>

      {/* <Banner translation={translation.banner} /> */}
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
      translation: {
        ...obj?.newsletter,
        banner:
          obj?.newsletter?.banner ||
          obj?.tour?.banner ||
          translationIT?.newsletter?.banner,
      },
    },
    revalidate: 60,
  };
}
