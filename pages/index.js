import Head from "next/head";
import Image from "next/image";
import Hero from "../components/layout/hero";
import Insta from "../components/sectionFour/insta";
import Mission from "../components/sectionOne/mission";
import AboutMe from "../components/sectionThree/aboutMe";
import Map from "../components/sectionTwo/map";
import translationIT from "../public/locales/it/it.json";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Luisa Quaglia - Guida Turistica</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Mission />
      <Map translation={translationIT?.home?.map} />
      <AboutMe />
      <Insta />
    </div>
  );
}
