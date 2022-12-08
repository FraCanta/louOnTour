import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Testimonials from "./testimonials";
import Testimonials2 from "./testimonials2";

const AboutMe = ({ translation }) => {
  return (
    <div className="about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full bg-[#232F37] mt-20 text-white flex items-center  overflow-x-hidden">
      <div className="grid gap-14 md:gap-14 xl:gap-18 grid-cols-1  justify-items-center content-center w-11/12 2xl:w-4/5 mx-auto h-full pt-10">
        <div>
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl text-bold">
            {translation?.subTitle}
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  md:leading-none lg:leading-none mb-10">
            {translation?.title}
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 text-white">
            {translation?.paragraph}
          </p>

          <Link href="/chiSono">
            <button className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-[#FE6847]  font-[600] shadow-3xl border border-[#FE6847] hover:transition-all hover:bg-white hover:border-white hover:scale-110 uppercase">
              {translation?.button}
              <Icon icon="bi:arrow-right" />
            </button>
          </Link>
        </div>
        <div>
          {/* <Testimonials translation={translation} /> */}
          <Testimonials2 translation={translation} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
