import Head from "next/head";
import Image from "next/image";
import Hero from "../components/layout/hero";
import Mission from "../components/sectionOne/mission";
import Map from "../components/sectionTwo/map";

export default function Home() {
  return (
    <div className={styles.container}>
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
