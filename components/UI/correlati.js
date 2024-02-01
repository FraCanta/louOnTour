import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Correlati = ({ city, others, correlati }) => {
  return (
    <>
      <div className="container w-[90%] xl:w-4/5 mx-auto pt-10">
        <h2 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#2C395B] lg:text-center pb-8 ">
          {correlati?.title}
        </h2>
        <div className="w-full h-[1px] bg-[#2C395B] bg-opacity-20"></div>
      </div>
      {/* carousel desktop */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  w-4/5 mx-auto min-h-[40vh] gap-10 my-10">
        {others
          ?.filter((el) =>
            !!el?.translatedTitle
              ? el?.translatedTitle !== city?.titleImg
              : el?.title !== city?.titleImg
          )
          .map((el, i) => (
            <div
              className="card w-full lg:w-50  shadow-xl mb-4 lg:mb-0 !pt-0 bg-white"
              key={i}
            >
              <Link href={el?.link} className=" hand-pointer ">
                <Image
                  src={el?.img}
                  alt={el?.title}
                  priority
                  width={461}
                  height={420}
                  className="w-full h-auto md:h-[450px] lg:h-[300px] object-cover rounded-t-lg object-top "
                />
                <div className="card-body justify-between !p-[1.5rem]">
                  <h2 className="card-title text-[#2C395B]  hover:underline text-base">
                    {!!el.translatedTitle ? el.translatedTitle : el?.title}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
      </section>
    </>
  );
};

export default Correlati;
