import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicContactForm = dynamic(() =>
  import("../components/contactPage/contactForm")
);
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { MaskText } from "../components/UI/MaskText";

const Contact = ({ translation }) => {
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-11/12 xl:w-4/5 min-h-[30vh] container mx-auto flex flex-col lg:flex-row py-6 xl:py-8">
        <div className="w-full ">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl">Contact</h4>
          <MaskText>
            <h2 className="text-4xl md:text-6xl 3xl:text-[100px] font-bold mt-2   text-[#2C395B]">
              {translation?.title}
            </h2>
          </MaskText>
        </div>
      </div>
      <DynamicContactForm translation={translation} />
    </>
  );
};

export default Contact;

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
      translation: obj?.contatti,
    },
    revalidate: 60,
  };
}
