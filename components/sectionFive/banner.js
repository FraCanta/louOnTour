import React from "react";
import CtaPrimary from "../button/CtaPrimary";
import { MaskText } from "../UI/MaskText";
import BgAnimation from "../bgAnimation/bgAnimation";

const Banner = ({ translation }) => {
  return (
    <>
      <section className="flex flex-col items-center min-h-[35vh] 2xl:min-h-[20vh] fxl:min-h-[30vh] qhd:min-h-[36vh] justify-end">
        <div className="flex flex-col items-center justify-center w-11/12 qhd:max-w-[1900px] gap-2 qhd:gap-4 pt-20 qhd:pt-28">
          <div className="flex flex-col gap-2 text-center">
            <MaskText>
              <h2 className="text-3xl md:text-5xl qhd:text-[4.4rem] font-bold leading-[1] md:mb-0">
                {translation?.text}
              </h2>
            </MaskText>
            <p className="lg:text-center text-para mx-auto text-base xl:text-lg qhd:text-2xl 3xl:text-[2.5rem] leading-6 2xl:leading-9 qhd:leading-10 3xl:leading-[3.5rem] mb-5 font-regular">
              {translation?.paragrafo}
            </p>
          </div>

          <CtaPrimary link="mailto:luisaquaglia.tourguide@gmail.com">
            {translation?.button}
          </CtaPrimary>
        </div>
      </section>
      <div className="hero2 min-h-[65vh] 2xl:min-h-[80vh] fxl:min-h-[70svh] qhd:min-h-[78svh]">
        <BgAnimation />
      </div>
    </>
  );
};

export default Banner;
