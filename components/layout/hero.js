import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import HeroImg from "../../public/assets/hero_img2.png";
const Hero = ({ translation }) => {
  return (
    <div className="hero w-[100%] mx-auto min-h-[calc(100vh_-_80px)] 2xl:min-h-screen  flex flex-col justify-between 2xl:justify-center items-center gap-10">
      <div className="flex flex-col items-center  2xl:justify-center  z-10 title w-[90%] xl:w-full">
        <h1 className="text-[3.5rem] md:text-[8rem] fxl:text-[10rem] font-bold tracking-normal md:mb-0 mt-5 ">
          {translation?.name}
        </h1>
        <p className="text-center  w-full 2xl:w-[58%] mx-auto text-base md:text-[1.2rem] 2xl:text-[1.5rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-regular">
          {translation?.paragraph}
        </p>
        {/* <div className="w-full lg:w-max h-full flex justify-center">
          <Link href="/contatti">
            <Cta>get started</Cta>
          </Link>
          <Link href="/contatti">
            <Cta>Scopri i tours</Cta>
          </Link>
        </div> */}
        <div className="justify-center items-center gap-[28.76px] flex flex-col lg:flex-row w-full h-full">
          <div className="w-full lg:w-max h-full flex justify-center">
            <Link
              href="/contatti"
              className="text-center capitalize font-bold py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#fe6847] w-full text-white"
            >
              get Started
            </Link>
          </div>
          <div className="w-full lg:w-max h-full flex justify-center">
            <Link
              href="/tour"
              className="w-full lg:w-max-content text-center text-[#2c395b] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md border-2 border-[#fe6847]"
            >
              Scopri di più
            </Link>
          </div>
        </div>
      </div>

      <div className="relative h-[200px] xl:h-[400px] w-full ">
        <Image
          src={HeroImg}
          fill
          alt="hero gallery"
          className="h-full object-cover xl:object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
