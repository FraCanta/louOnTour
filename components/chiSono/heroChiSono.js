import Image from "next/image";
import React from "react";
import LouAvatar from "../../public/assets/lou-avatar.webp";
import CurvedText from "./curvedText";
import { MaskText } from "../UI/MaskText";

const HeroChiSono = ({ translation }) => {
  return (
    <div className="relative w-full h-screen pt-0 mx-auto xl:w-11/12 xl:pt-10">
      <div className="flex flex-col w-full h-full xl:flex-row ">
        <div className="w-full min-h-screen xl:w-[65%] fxl:w-[60%] bg-[#2C395B]  xl:hero_left grain">
          <div className="flex flex-col justify-center w-11/12 h-full p-6 fxl:p-10 ">
            <h3 className="text-[#FE6847]">{translation?.subTitle}</h3>

            <h1>
              <MaskText>
                <div className="text-[2.2rem] md:text-[6rem] 2xl:text-6xl xl:text-[45px] 3xl:text-[120px] font-bold  text-white ">
                  {" "}
                  {translation?.title?.primo}{" "}
                </div>{" "}
              </MaskText>
              <MaskText>
                <div className="text-[2.2rem] md:text-[6rem] 2xl:text-6xl xl:text-[45px] 3xl:text-[120px] font-bold  text-white ">
                  {translation?.title?.secondo}{" "}
                </div>{" "}
              </MaskText>
              <MaskText>
                <div className="text-[2.2rem] md:text-[6rem] 2xl:text-6xl xl:text-[45px] 3xl:text-[120px] font-semibold  text-white italic">
                  {translation?.title?.terzo}{" "}
                </div>
              </MaskText>
            </h1>

            <p className="mt-4 mb-8 text-xl sm:text-lg fxl:text-2xl sm:mt-8 text-white/90 xl:w-4/5">
              {translation?.paragraph}
            </p>
          </div>
        </div>
        <div className="rounded-lg shadow-2xl hidden xl:block w-[70vh] h-[80%] p-8 absolute left-[59%] top-[20%]">
          <Image
            src={LouAvatar}
            alt="lou_avatar"
            width={550}
            height={688}
            priority
            className="absolute inset-0 object-cover w-full h-full min-h-full rounded-lg"
          />
        </div>
        <CurvedText />
      </div>
    </div>
  );
};

export default HeroChiSono;
