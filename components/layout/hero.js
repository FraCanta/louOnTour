import React from "react";
import Cta from "../button/button";

const Hero = () => {
  return (
    <div className="hero_container leading-none w-full">
      <section className="text-center h-[calc(100vh_-_98px)] flex flex-col items-center justify-center hero">
        <h2 className="text-[1.2rem] md:text-[2rem] 2xl:text-[2.5rem] lg:text-[2.5rem] xl:text-[3.5rem] fxl:text-[4rem] font-medium text-[#D93280] mb-4 mt-10">
          Tuscan Experience
        </h2>
        <h1 className="text-[4.5rem] md:text-[8rem] 2xl:text-[12rem] lg:text-[8rem] xl:text-[10rem] fxl:text-[15.625rem] font-bold tracking-[-0.020em] text-white mb-5 md:mb-8 mt-5">
          Lou On Tour
        </h1>

        <p className="w-4/5 2xl:w-3/4 mx-auto text-white text-[0.86rem] md:text-[1.2rem] 2xl:text-[1.4rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2.5rem] leading-tight mb-5">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo
          necessitatibus ipsam, assumenda, modi.
        </p>
        <Cta>get started</Cta>
      </section>
    </div>
  );
};

export default Hero;
