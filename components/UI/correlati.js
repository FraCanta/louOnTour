import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Correlati = ({ city, others }) => {
  return (
    <>
      <div className="container w-11/12 xl:w-4/5 mx-auto pt-10">
        <h3 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] lg:text-center pb-8 ">
          Ecco per te altre proposte
        </h3>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>
      </div>

      <div className=" min-h-[38vh] lg:min-h-[40vh] 3xl:min-h-[80vh]  w-full 2xl:p-8 hidden xl:flex">
        <div
          className={`container mx-auto w-full xl:w-4/5 text-[1.5rem] xl:text-5xl mb-10 text-white overflow-hidden flex `}
        >
          {others
            ?.filter((el) => el?.title !== city?.titleImg)
            .map((el, i) => (
              <div className={`  w-[25%]  relative aspect-square `} key={i}>
                <Link href={el?.link} className=" hand-pointer">
                  <Image
                    src={el?.img}
                    alt={el?.titleImg}
                    width={500}
                    height={500}
                    style={{ width: "auto", height: "auto" }}
                    layout="fixed"
                    className="min-h-full h-full object-cover w-full absolute z-2 p-4 !rounded-[1.5rem] gallery-image"
                  />
                </Link>
                <div
                  className={`absolute bottom-[1.5rem] xl:bottom-8 left-10 bgText text-base xl:text-2xl w-3/5 `}
                >
                  <p className="leading-4 text-xl">{el?.title}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="min-h-[20vh] w-full 2xl:p-8 lg:hidden ">
        <div className=" carousel carousel-center p-4 space-x-4 ">
          {others
            ?.filter((el) => el?.title !== city?.titleImg)
            .map((el, i) => (
              <div key={i}>
                <div className="carousel-item w-[180px] h-[180px] relative">
                  <Link href={el?.link}>
                    <Image
                      src={el?.img}
                      alt={el?.titleImg}
                      // fill
                      width={300}
                      height={300}
                      className="rounded-box  h-full w-full absolute"
                    />
                  </Link>
                  <div
                    className={`absolute bottom-[1rem]  left-[1rem] bgText text-base xl:text-2xl w-3/5 text-white`}
                  >
                    <p className="leading-4 text-xl">{el?.title}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Correlati;
