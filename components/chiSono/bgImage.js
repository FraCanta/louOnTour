import React from "react";

const BgImage = ({ translation }) => {
  return (
    <>
      <div className="bgImage w-full xl:w-4/5 mx-auto"></div>
      <div className="text-left 2xl:text-center ">
        <div className="container w-11/12 md:w-4/5 mx-auto">
          <div className="mx-auto relative z-1">
            <div>
              <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl   mt-8 sm:mt-16 mb-20 text-[#515151] leading-6 2xl:leading-9 mx-auto">
                {translation?.finalP}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BgImage;
