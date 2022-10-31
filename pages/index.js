import Head from "next/head";
import Image from "next/image";
import Hero from "../components/hero/hero";
import Mission from "../components/sectionOne/mission";
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
    </div>
  );
}
