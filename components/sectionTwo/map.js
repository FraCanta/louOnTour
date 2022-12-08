import React, { useState } from "react";
import Image from "next/image";
import Toscana from "../../public/assets/toscana.svg";
import { Icon } from "@iconify/react";
import Cta from "../button/button";
import Link from "next/link";
const Map = ({ translation }) => {
  return (
    <div className="min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  container mx-auto w-11/12 2xl:w-4/5">
      <div className="grid gap-14 md:gap-14 xl:gap-18 grid-cols-1 lg:grid-cols-2 justify-items-center content-center pt-12 2xl:pt-10  overflow-x-hidden lg:overflow-visible">
        <div className="p-0 ">
          <h4 className="text-[#FE6847] text-bold text-xl 3xl:text-4xl">
            {translation?.subTitle}
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 3xl:mt-12 leading-10 lg:leading-[4rem] 3xl:leading-[5.5rem] text-[#232F37]">
            {translation?.title}
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl  mt-4 lg:mt-16 3xl:mt-20 mb-8 text-[#515151] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
            {translation?.paragraph}
          </p>
          <Link href="/contatti">
            <Cta> {translation?.button}</Cta>
          </Link>
        </div>

        <div className="pt-0 w-[650px] height-[697.359px] relative ">
          <Image
            src={Toscana}
            priority
            alt="map"
            width="auto"
            height="auto"
            className="opacity-50"
          />
          {translation?.markers?.map((el, i) => (
            <div
              key={i}
              className="flex flex-col justify-center absolute items-center"
              style={
                el?.marker?.top > 0
                  ? {
                      top: `${el?.marker?.top}px`,
                      right: `${el?.marker?.right}px`,
                      color: "#FE6847",
                    }
                  : {
                      bottom: `${el?.marker?.bottom}px`,
                      right: `${el?.marker?.right}px`,
                      color: "#FE6847",
                    }
              }
            >
              {el?.link?.length > 0 && (
                <Link href={`/locations/${el?.title}`}>
                  <Icon
                    icon="fontisto:map-marker-alt"
                    width="32"
                    className={` animate-bounce cursor-pointer`}
                    alt={el?.title}
                    id={el?.id}
                  />
                </Link>
              )}
              {el?.link?.length > 0 && (
                <div className="bg-[#FE6847] w-[6px] h-[6px] absolute rounded-[50%] top-[63%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              )}

              <p className="uppercase text-[0.8rem] text-[#232F37] font-medium py-2">
                {el?.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
