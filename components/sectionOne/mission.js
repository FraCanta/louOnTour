import Link from "next/link";
import React from "react";

const Mission = ({ translation }) => {
  return (
    <div className="min-h-[38vh] lg:min-h-[60vh] 3xl:min-h-[80vh] text-left lg:text-center py-12 2xl:py-20 flex items-center justify-center">
      <div className="container w-11/12 2xl:w-4/5 mx-auto xl:h-full ">
        <div className="mx-auto relative z-1">
          <div className="flex flex-col gap-6">
            <h3 className="text-[#FE6847] text-bold text-xl 3xl:text-4xl">
              {translation?.subTitle}
            </h3>
            <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  leading-10 text-[#2C395B]">
              {translation?.title}
            </h2>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl  mt-4 lg:mt-16 3xl:mt-20  text-[#2C395B] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
              {translation?.paragraph1}
            </p>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   text-[#2C395B] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
              {translation?.paragraph2}
            </p>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl    text-[#2C395B] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
              {translation?.paragraph3}
            </p>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl    text-[#2C395B] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
              {translation?.paragraph4}
            </p>
            <Link
              href="/contatti"
              className="text-center capitalize font-bold py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#fe6847] w-full text-white"
            >
              {translation?.paragraph5}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
