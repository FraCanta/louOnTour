import React from "react";

const Text = ({ translation }) => {
  return (
    <div className="min-h-[50vh] text-left 2xl:text-center pt-10 2xl:pt-10 flex items-center justify-center">
      <div className="container w-4/5 md:w-4/5 mx-auto pt-0 xl:pt-12 md:pt-2 xl:h-full ">
        <div className="mx-auto relative z-1">
          <div>
            <h3 className="text-4xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37]">
              {translation?.secondTitle}
            </h3>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl   mt-4 sm:mt-16 mb-8 text-[#515151] leading-6 2xl:leading-9 2xl:w-[80% mx-auto">
              {translation?.secondPa}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Text;
