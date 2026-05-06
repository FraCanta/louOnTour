import dynamic from "next/dynamic";

const DynamicText = dynamic(() => import("../components/chiSono/text"));
const DynamicBgImage = dynamic(() => import("../components/chiSono/bgImage"));
const DynamicBanner = dynamic(() => import("../components/chiSono/banner"));
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import HeroChiSono from "../components/chiSono/hero_chisono";
import Carousel from "../components/chiSono/Carousel";
import { MaskText } from "../components/UI/MaskText";
import Text2 from "../components/chiSono/text2";

const ChiSono = ({ translation, home }) => {
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.hero?.paragraph} />
        <meta
          property="og:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={translation?.head?.title} />
        <meta
          property="og:description"
          content={translation?.hero?.paragraph}
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
          content={translation?.hero?.paragraph}
        />
        <meta
          name="twitter:image"
          content="https://luisaquaglia-tourguide.com/assets/lou-avatar.webp"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroChiSono translation={translation?.hero} />
      <DynamicText translation={translation?.hero} />
      <DynamicBgImage translation={translation?.hero} />
      <Text2 translation={translation?.hero} />
      <div className="flex flex-col lg:min-h-screen gap-10 lg:gap-20 lg:my-[150px] bg-para/10 py-10 justify-center lg:py-20 ">
        <MaskText>
          {" "}
          <h2 className="mx-auto text-4xl font-bold text-center text-para lg:text-7xl">
            {translation?.galleryTitle}
          </h2>
        </MaskText>
        <Carousel translation={translation} />
      </div>

      <DynamicBanner translation={translation?.banner} />
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
