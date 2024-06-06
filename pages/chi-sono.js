import React from "react";
import dynamic from "next/dynamic";
const DynamicHeroChiSono = dynamic(() =>
  import("../components/chiSono/heroChiSono")
);
const DynamicText = dynamic(() => import("../components/chiSono/text"));
const DynamicBgImage = dynamic(() => import("../components/chiSono/bgImage"));
const DynamicGalleryTours = dynamic(() =>
  import("../components/UI/simpleGallery")
);
const DynamicBanner = dynamic(() => import("../components/sectionFive/banner"));
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import Gallery3d from "../components/UI/Gallery3D";

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
      <DynamicHeroChiSono translation={translation?.hero} />
      <DynamicText translation={translation?.hero} />
      <DynamicBgImage translation={translation?.hero} />
      {/* <DynamicGalleryTours
        imageArray={translation?.galleria}
        galleryID="gallery--click-to-next"
        galleryTitle={translation?.galleryTitle}
      /> */}
      <Gallery3d
        imageArray={translation?.galleria}
        galleryTitle={translation?.galleryTitle}
      />
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
