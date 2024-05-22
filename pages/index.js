import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicHero = dynamic(() => import("../components/layout/hero"));
const DynamicMission = dynamic(() =>
  import("../components/sectionOne/mission")
);
const DynamicAboutMe = dynamic(() =>
  import("../components/sectionThree/aboutMe")
);
const DynamicMap = dynamic(() => import("../components/sectionTwo/map"));
const DynamicInsta = dynamic(() => import("../components/sectionFour/insta"));
const DynamicBanner = dynamic(() => import("../components/sectionFive/banner"));

import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";
import BlogSection from "../components/blogSection/blogSection";
import {
  getPosts,
  getCategories,
  getMedia,
  getTagId,
} from "../utils/wordpress";

export default function Home({ translation, post, category }) {
  const { locale } = useRouter();
  return (
    <>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.head?.description} />
        <meta name="keywords" content={translation?.head?.keywords} />
        <link rel="icon" href="/favicon.ico" />
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
          content="https://luisaquaglia-tourguide.com/assets/og-img.png"
        />
        <meta property="og:site_name" content="Lou On Tour" />
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
          content="https://luisaquaglia-tourguide.com/assets/og-img.png"
        />
        <meta
          name="google-site-verification"
          content="A8ZnvhuSVmJCOMm45EmOyXMjn1ZMITvQJ-ixpxR8bWI"
        />
      </Head>

      <DynamicHero translation={translation?.hero} />
      {/* <DynamicMission translation={translation?.mission} /> */}
      <DynamicMap translation={translation?.map} />
      <DynamicAboutMe translation={translation?.about} />
      <DynamicInsta translation={translation?.socialLou} />
      <BlogSection post={post} translation={translation?.blogSection} />

      <DynamicBanner translation={translation?.banner} />
    </>
  );
}
export async function getStaticProps({ locale }) {
  const idLocale = await getTagId(locale); // recupera id della lingua attuale
  const post = await getPosts(idLocale); //recupera post nella lingua attuale
  const category = await getCategories();
  const media = await getMedia();

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
      translation: obj?.home,
      post: post.sort((a, b) => a?.date > b?.date).filter((el, i) => i < 3),
      category: category,
      media: media,
    },
    revalidate: 60,
  };
}
