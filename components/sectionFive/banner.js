import React from "react";
import CtaPrimary from "../button/CtaPrimary";
import { MaskText } from "../UI/MaskText";

const Banner = ({ translation }) => {
  return (
    <section className="flex flex-col items-center min-h-[50vh] justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 2xl:w-4/5 gap-4">
        <div className="flex flex-col gap-2 text-center">
          <MaskText>
            <h2 className="text-4xl md:text-5xl fxl:text-[10rem] font-bold leading-[1] md:mb-0 ">
              {translation?.text}
            </h2>
          </MaskText>
          <p className="lg:text-center max-w-3xl text-para  mx-auto text-xl 2xl:text-2xl lg:text-[1.2rem] xl:text-[1.5rem] fxl:text-[2rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-regular">
            {translation?.paragrafo}
          </p>
        </div>

        <CtaPrimary link="/contatti">{translation?.button}</CtaPrimary>
      </div>
    </section>
  );
};

export default Banner;
