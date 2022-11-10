import React from "react";
import HeroChiSono from "../components/chiSono/heroChiSono";
import Head from "next/head";
import Text from "../components/chiSono/text";
import BgImage from "../components/chiSono/bgImage";

const ChiSono = () => {
  return (
    <>
      <Head>
        <title>Lou On Tour - Chi Sono</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroChiSono />
      <Text />
      <BgImage />
    </>
  );
};

export default ChiSono;
