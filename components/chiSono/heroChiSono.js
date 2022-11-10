import Image from "next/image";
import React from "react";
import LouAvatar from "../../public/assets/lou-avatar.webp";
import CurvedText from "./curvedText";

const HeroChiSono = () => {
  return (
    <div className="w-full xl:w-4/5  min-h-screen mx-auto pt-0 xl:pt-10">
      <div className="flex h-full flex-col xl:flex-row">
        <div className="w-full h-screen xl:w-4/5 bg-[#232F37]  p-8 xl:hero_left">
          <div className="flex flex-col justify-center h-full">
            <h4 className="text-[#E3494D]">About me</h4>
            <h2 className="text-5xl 2xl:text-[64px] xl:text-[45px] font-medium md:leading-none lg:leading-none text-white ">
              Ciao! Mi Presento sono Luisa Quaglia!
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
        <div className="hidden xl:block w-full xl:h-screen xl:w-1/2 p-0 2xl:p-8">
          <div className="w-full h-full p-8 relative">
            <Image
              src={LouAvatar}
              className=" rounded-lg shadow-2xl 2xl:w-[400px] 2xl:h-[500px] absolute -left-20 top-20"
              alt="lou_avatar"
            />
            <CurvedText />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroChiSono;
