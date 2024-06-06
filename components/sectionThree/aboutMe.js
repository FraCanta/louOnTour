import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Testimonials2 from "./testimonials2";
import CtaWhite from "../button/CtaWhite";
import { MaskText } from "../UI/MaskText";
import TestimonialsCarousel from "./testimonialsCarousel";

const AboutMe = ({ translation }) => {
  return (
    <div className="grain about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full bg-[#2C395B] mt-20 text-white flex items-center  overflow-x-hidden">
      <div className="grid gap-14 md:gap-14 xl:gap-18 grid-cols-1  justify-items-center content-center w-11/12 mx-auto h-full pt-10">
        <div className="flex flex-col w-full">
          <h3 className="text-[#FE6847] text-xl 3xl:text-4xl font-bold">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-6xl 3xl:text-[100px] font-bold !text-white  mb-10">
              {translation?.title}
            </h2>
          </MaskText>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 text-white/90 max-w-5xl">
            {translation?.paragraph}
          </p>

          <CtaWhite link="/chi-sono">{translation?.button}</CtaWhite>
        </div>
        <div className="w-full mx-auto">
          {/* <Testimonials2 translation={translation} /> */}
          <TestimonialsCarousel translation={translation} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
