import Head from "next/head";
import Image from "next/image";
import Hero from "../components/layout/hero";
import Insta from "../components/sectionFour/insta";
import Mission from "../components/sectionOne/mission";
import AboutMe from "../components/sectionThree/aboutMe";
import Map from "../components/sectionTwo/map";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import { useRouter } from "next/router";
// import gsap from "gsap";
// import Transition from "../components/transition/transition";

export default function Home({ translation }) {
  // const home = gsap.timeline(); // prima timeline per transition della pagina

  const { locale } = useRouter();
  return (
    <div>
      <Head>
        <title>Lou On Tour - Guida Turistica</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero translation={translation?.home?.hero} />
      <Mission />
      <Map translation={translation?.home?.map} />
      <AboutMe />
      <Insta />
      {/* <Transition timeline={home} /> */}
    </div>
  );
}
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
      translation: obj,
    },
    revalidate: 60,
  };
}
