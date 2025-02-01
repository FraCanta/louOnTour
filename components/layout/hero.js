import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroImg from "../../public/assets/hero_img2.jpg";
import CtaPrimary from "../button/CtaPrimary";
import CtaOutline from "../button/CtaOutline";
import { MaskText } from "../UI/MaskText";
const Hero = ({ translation }) => {
  return (
    <div className="hero w-[100%] mx-auto min-h-[calc(100vh_-_80px)] 2xl:min-h-[calc(100vh_-_80px)] fxl:min-h-[calc(100vh_-_10px)] flex flex-col justify-between 2xl:justify-evenly items-center gap-20">
      <div className="flex flex-col items-center  justify-center lg:text-center  w-[90%] xl:w-full gap-4">
        <MaskText>
          <h1 className="text-[2.3rem] md:text-[3.5rem] fxl:text-[4.5rem] font-bold leading-[1] md:mb-0 mt-20 ">
            {translation?.name}
          </h1>
        </MaskText>
        <MaskText>
          <p className="lg:text-center text-para  w-full text-[1.4rem] 2xl:text-[1.5rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[1.8rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-regular">
            {translation?.paragraph}
          </p>
        </MaskText>

        <div className="justify-center items-center gap-[28.76px] flex flex-col lg:flex-row w-full h-full">
          <div className="flex justify-center w-full h-full lg:w-max">
            <CtaPrimary link="/tours-da-fare">{translation?.cta}</CtaPrimary>
          </div>
          <div className="flex justify-center w-full h-full lg:w-max">
            <CtaOutline link="/contatti">{translation?.tourcta}</CtaOutline>
          </div>
        </div>
      </div>

      <div className="relative h-[200px] xl:h-[400px] w-full ">
        <Image
          src={HeroImg}
          fill
          alt="hero gallery"
          className="object-cover h-auto xl:object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
