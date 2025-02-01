import React from "react";
import BgAnimation from "../components/bgAnimation/bgAnimation";
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import ToursItem from "../components/toursItem/toursItem";
import Banner from "../components/sectionFive/banner";

const Tours = ({ translation }) => {
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.head?.description} />
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
          content="https://luisaquaglia-tourguide.com/assets/lou-avatar.webp"
        />

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
          content="https://luisaquaglia-tourguide.com/assets/lou-avatar.webp"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero2 relative min-h-[70vh] 2xl:min-h-[80vh] w-11/12">
        <BgAnimation />
      </div>
      <div className="flex flex-col justify-center w-11/12 gap-4 py-10 mx-auto text-xl font-normal xl:text-center text-main xl:text-2xl text-para">
        {translation?.toursPreview?.map((el, i) => {
          return (
            <p
              key={i}
              className="lg:text-center text-para  w-full   text-xl fxl:text-2xl 3xl:text-3xl  3xl:leading-[3.5rem] mb-5 font-regular"
              dangerouslySetInnerHTML={{ __html: el.p }}
            ></p>
          );
        })}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  w-[90%] mx-auto min-h-[40vh] gap-4 my-6">
        {translation?.tourItem?.map((el, i) => {
          return (
            <ToursItem
              key={i}
              img={el?.img}
              link={el?.link}
              name={el.name}
              descrizione={el.descrizione}
              text={el.text}
            />
          );
        })}
      </section>
      {/* <section className=" bg-second/20">
        <div className="w-[90%] mx-auto my-[50px] py-10">
          <MaskText>
            <h2 className="py-6 text-6xl font-bold">FAQs</h2>
          </MaskText>
          <Faq translation={translation.faq} />
        </div>
      </section> */}

      <Banner translation={translation?.banner} />
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
