import Head from "next/head";
import Image from "next/image";
import Hero from "../components/layout/hero";
import Mission from "../components/sectionOne/mission";
import AboutMe from "../components/sectionThree/aboutMe";
import Map from "../components/sectionTwo/map";

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
      <Map />
      <AboutMe />
    </div>
  );
}
