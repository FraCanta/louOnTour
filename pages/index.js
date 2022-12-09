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
import { getPosts, getCategories, getMedia, getTags } from "../utils/wordpress";

export default function Home({ translation, post, category, tags }) {
  const { locale } = useRouter();
  return (
    <div>
      <Head>
        <title>{translation?.head?.title}</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicHero translation={translation?.hero} />
      <DynamicMission translation={translation?.mission} />
      <DynamicMap translation={translation?.map} />
      <DynamicAboutMe translation={translation?.about} />
      <DynamicInsta translation={translation?.socialLou} />
      <BlogSection post={post} />

      <DynamicBanner translation={translation?.banner} />
    </div>
  );
}
export async function getStaticProps(locale) {
  const post = await getPosts();
  const category = await getCategories();
  const media = await getMedia();
  const tags = await getTags();
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
      translation: obj?.home,
      post: post,
      category: category,
      media: media,
      tags: tags,
    },
    revalidate: 60,
  };
}
