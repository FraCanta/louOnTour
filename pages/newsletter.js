import React from "react";
import Subscribe from "../components/newsletter/subscribe";
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";

const Newsletter = ({ translation }) => {
  return (
    <>
      <Head>
        <title>Lou On Tour - Newsletter</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-[calc(100vh_-_100px)] flex justify-center items-center">
        <Subscribe translation={translation} />
      </div>
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
