import React from "react";
import Cta from "../button/button";

const Hero = () => {
  return (
    <div className="hero_container leading-none w-full">
      <section className="text-center h-[calc(100vh_-_98px)] flex flex-col items-center justify-center hero">
        <h2 className="text-[1.8rem] 2xl:text-[2.5rem] fxl:text-[4rem] font-medium text-[#D93280] mb-4 mt-10">
          Tuscan Experience
        </h2>
        <h1 className="text-[6.5rem] 2xl:text-[12rem] fxl:text-[15.625rem] font-bold tracking-[-0.020em] text-white mb-8 mt-5">
          Lou On Tour
        </h1>

        <p className="w-3/4 mx-auto text-white text-[0.86rem] 2xl:text-[1.4rem] fxl:text-[2.5rem] leading-tight mb-5">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo
          necessitatibus ipsam, assumenda, modi.
        </p>
        <Cta>get started</Cta>
      </section>
    </div>
  );
};

export default Hero;
