import React from "react";
import BgAnimation from "../components/bgAnimation/bgAnimation";
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import ToursItem from "../components/toursItem/toursItem";

const Tours = ({ translation }) => {
  console.log(translation);
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.head?.description} />
        <meta property="og:url" content="https://www.louontour.it/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={translation?.head?.title} />
        <meta
          property="og:description"
          content={translation?.head?.description}
        />

        <meta
          property="og:image"
          content="https://louontour.it/assets/lou-avatar.webp"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="louontour.it" />
        <meta property="twitter:url" content="https://www.louontour.it/" />
        <meta name="twitter:title" content={translation?.head?.title} />
        <meta
          name="twitter:description"
          content={translation?.head?.description}
        />
        <meta
          name="twitter:image"
          content="https://louontour.it/assets/lou-avatar.webp"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-left py-10 2xl:pb-8 flex  w-[90%] mx-auto">
        <h1 className="text-4xl md:text-[60px] font-bold mt-8 leading-10 text-[#2C395B]">
          {translation?.toursTitle}
        </h1>
      </div>
      <div className="hero2 relative min-h-[70vh] 2xl:min-h-[65vh] w-11/12">
        <BgAnimation />
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  w-[90%] mx-auto min-h-[40vh] gap-10 my-10">
        {translation?.tourItem?.map((el, i) => {
          return (
            <ToursItem key={i} img={el?.img} link={el?.link} name={el.name} />
          );
        })}
      </section>
    </>
  );
};

export default Tours;

export async function getStaticProps(locale, context) {
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
      translation: obj?.tours,
    },
    revalidate: 60,
  };
}
