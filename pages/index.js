import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Luisa Quaglia - Guida Turistica</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.footer}>
        <nav>Nav</nav>
      </header>

      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
