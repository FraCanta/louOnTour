import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroImg from "../../public/assets/hero_img2.jpg";
const Hero = ({ translation }) => {
  return (
    <div className="hero w-[100%] mx-auto min-h-[calc(100vh_-_80px)] 2xl:min-h-[calc(100vh_-_80px)]  flex flex-col justify-between 2xl:justify-evenly items-center gap-20">
      <div className="flex flex-col items-center  justify-center text-center  w-[90%] xl:w-full gap-2">
        <h1 className="text-[3rem] md:text-[5rem] fxl:text-[10rem] font-bold leading-[1] md:mb-0 mt-20 ">
          {translation?.name}
        </h1>
        <p className="text-center  w-full 2xl:w-[68%] mx-auto text-[1.2rem] 2xl:text-[1.5rem] lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-regular">
          {translation?.paragraph}
        </p>

        <div className="justify-center items-center gap-[28.76px] flex flex-col lg:flex-row w-full h-full">
          <div className="w-full lg:w-max h-full flex justify-center">
            <Link
              href="/tours"
              className="text-center capitalize font-bold py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#2c395b] w-full text-white"
            >
              {translation?.cta}
            </Link>
          </div>
          <div className="w-full lg:w-max h-full flex justify-center">
            <Link
              href="/contatti"
              className="w-full lg:w-max-content text-center text-[#2c395b] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md border-2 border-[#2c395b]"
            >
              {translation?.tourcta}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative h-[200px] xl:h-[400px] w-full ">
        <Image
          src={HeroImg}
          fill
          alt="hero gallery"
          className="h-auto object-cover xl:object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
