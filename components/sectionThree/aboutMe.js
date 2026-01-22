import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Testimonials2 from "./testimonials2";
import CtaWhite from "../button/CtaWhite";
import { MaskText } from "../UI/MaskText";
import TestimonialsCarousel from "./testimonialsCarousel";

const AboutMe = ({ translation }) => {
  return (
    <div className="grain about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full bg-principle py-20 text-white flex items-center  overflow-x-hidden">
      <div className="grid content-center w-full h-full grid-cols-1 pt-10 mx-auto gap-14 md:gap-14 xl:gap-18 justify-items-center">
        <div className="flex flex-col items-center justify-center w-full px-4 mx-auto text-center 2xl:w-3/5">
          <h3 className="text-[#FE6847] text-xl 3xl:text-4xl uppercase">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-5xl 3xl:text-[100px] font-bold !text-white  mb-10">
              {translation?.title}
            </h2>
          </MaskText>
          <p className="max-w-5xl mb-8 text-base 2xl:text-xl 3xl:text-3xl text-white/90">
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
