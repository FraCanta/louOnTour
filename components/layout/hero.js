import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Hero = ({ translation }) => {
  return (
    <>
      <div className="hero flex flex-col items-center justify-center ">
        <div className="parallax-layer layer-1a"></div>
        <div className="parallax-layer layer-2a"></div>
        <div className="parallax-layer layer-2ab"></div>

        <div className="parallax-layer layer-3a"></div>
        <div className="parallax-layer layer-3ab"></div>

        <div className="parallax-layer layer-4a"></div>
        <div className="parallax-layer layer-5a"></div>
        <div className="parallax-layer layer-6a"></div>
        <div className="parallax-layer layer-7a"></div>
        <div className="parallax-layer layer-6"></div>

        <div className="parallax-layer layer-5"></div>
        <div className="parallax-layer layer-4"></div>
        <div className="parallax-layer layer-3"></div>
        <div className="parallax-layer bike-1"></div>
        <div className="parallax-layer bike-2"></div>
        <div className="parallax-layer bike-3"></div>
        <div className="parallax-layer layer-2"></div>
        <div className="parallax-layer layer-1"></div>
        <div className="text-center h-full flex flex-col items-center justify-center absolute z-10 title">
          <h1 className="text-[4.5rem] md:text-[8rem] 2xl:text-[12rem] lg:text-[8rem] xl:text-[10rem] fxl:text-[15.625rem] font-bold tracking-[-0.020em] text-white mb-5 md:mb-0 mt-5 rotated:text-[5rem] rotated:mb-5">
            {translation?.name}
          </h1>
          <p className="w-11/12 2xl:w-[68%] mx-auto text-white text-basemd:text-[1.2rem] 2xl:text-[1.5rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-bold">
            {translation?.paragraph}
          </p>
          <Link href="/contatti">
            <Cta>get started</Cta>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Hero;
