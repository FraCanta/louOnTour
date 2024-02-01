import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Testimonials2 from "./testimonials2";

const AboutMe = ({ translation }) => {
  return (
    <div className="grain about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full bg-[#2C395B] mt-20 text-white flex items-center  overflow-x-hidden">
      <div className="grid gap-14 md:gap-14 xl:gap-18 grid-cols-1  justify-items-center content-center w-11/12 2xl:w-4/5 mx-auto h-full pt-10">
        <div>
          <h3 className="text-[#FE6847] text-xl 3xl:text-4xl text-bold">
            {translation?.subTitle}
          </h3>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium !text-white  md:leading-none lg:leading-none mb-10">
            {translation?.title}
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 text-white">
            {translation?.paragraph}
          </p>

          <Link
            href="/chiSono"
            className="flex gap-2 items-center max-w-max text-center text-[#fe6847] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md border-2 border-[#fe6847]"
          >
            {translation?.button}
            <Icon icon="bi:arrow-right" />
          </Link>
        </div>
        <div>
          <Testimonials2 translation={translation} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
