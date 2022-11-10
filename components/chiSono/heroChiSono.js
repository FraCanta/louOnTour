import Image from "next/image";
import React from "react";
import LouAvatar from "../../public/assets/lou-avatar.webp";
import CurvedText from "./curvedText";

const HeroChiSono = () => {
  return (
    <div className="w-full xl:w-4/5  h-screen mx-auto pt-0 xl:pt-10 relative">
      <div className="flex h-full w-full flex-col xl:flex-row ">
        <div className="w-full h-screen xl:w-[65%] bg-[#232F37]  p-8 xl:hero_left">
          <div className="flex flex-col justify-center h-full">
            <h4 className="text-[#E3494D]">About me</h4>
            <h2 className="text-[3rem] 2xl:text-[70px] xl:text-[45px] font-medium leading-[1.1] md:leading-none lg:leading-none text-white ">
              Ciao! Mi presento sono Luisa Quaglia!
            </h2>
            <p className="text-base sm:text-lg fxl:text-2xl mt-4 sm:mt-8 mb-8 text-white leading-6 2xl:leading-9 xl:w-4/5">
              Vivo vicino Volterra, in un agriturismo con mio marito Luigi, la
              nostra piccola Alice e due gatti perennemente affamati, Angus e
              Marla. Sono laureata in archeologia a Siena e ho lavorato in
              diverse zone sia in Italia che all’estero. Quando sono tornata ho
              lavorato nel museo archeologico di Volterra come guida per
              studenti delle scuole e poi ho co- gestito un parco
              archeologico all’Isola d’Elba.
            </p>
          </div>
        </div>
        {/* <div className="hidden xl:block w-full xl:h-screen xl:w-1/2 p-0 2xl:p-8"> */}
        <div className="rounded-lg shadow-2xl hidden xl:block w-[50vh] h-[65%] p-8 absolute left-[59%] top-[20%]">
          <Image
            src={LouAvatar}
            className="absolute inset-0"
            alt="lou_avatar"
          />
        </div>
        <CurvedText />

        {/* </div> */}
      </div>
    </div>
  );
};

export default HeroChiSono;
