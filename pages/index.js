import Head from "next/head";
import Image from "next/image";
import Mission from "../components/sectionOne/mission";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Luisa Quaglia - Guida Turistica</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Mission />
    </div>
  );
}
