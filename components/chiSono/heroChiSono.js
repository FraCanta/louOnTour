import Image from "next/image";
import React from "react";
import LouAvatar from "../../public/assets/lou-avatar.webp";
import CurvedText from "./curvedText";
import { MaskText } from "../UI/MaskText";

const HeroChiSono = ({ translation }) => {
  return (
    <div className="w-full xl:w-11/12 h-screen mx-auto pt-0 xl:pt-10 relative">
      <div className="flex h-full w-full flex-col xl:flex-row ">
        <div className="w-full h-screen xl:w-[65%] bg-[#2C395B] p-0 2xl:p-8 xl:hero_left grain">
          <div className="flex flex-col justify-center h-full w-11/12 mx-auto">
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
                <div className="text-[2.2rem] md:text-[6rem] 2xl:text-6xl xl:text-[45px] 3xl:text-[120px] font-bold  text-white ">
                  {translation?.title?.terzo}{" "}
                </div>
              </MaskText>
            </h1>

            <p className="text-xl sm:text-lg fxl:text-2xl mt-4 sm:mt-8 mb-8 text-white/90  xl:w-4/5">
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
            className="min-h-full h-full object-cover w-full absolute inset-0 rounded-lg"
          />
        </div>
        <CurvedText />
      </div>
    </div>
  );
};

export default HeroChiSono;
