import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";

const Hero = () => {
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
            Lou On Tour
          </h1>
          <p className="w-4/5 2xl:w-3/4 mx-auto text-white text-basemd:text-[1.2rem] 2xl:text-[1.5rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2rem] leading-7 mb-5 font-bold">
            Sono Luisa Quaglia, Guida Turistica abilitata in italiano e in
            inglese. Propongo tour guidati a Firenze, Volterra, Siena e la sua
            provincia. Sono a tua disposizione per disegnare il tuo tour su
            misura, secondo i tuoi gusti e le tue esigenze.
          </p>
          <Cta>get started</Cta>
        </div>
      </div>
    </>
  );
};

export default Hero;
