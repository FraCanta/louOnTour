import React from "react";

const Mission = ({ translation }) => {
  return (
    <div className="min-h-[38vh] lg:min-h-[60vh] 3xl:min-h-[80vh] text-left lg:text-center py-12 2xl:py-20 flex items-center justify-center">
      <div className="container w-11/12 2xl:w-4/5 mx-auto xl:h-full ">
        <div className="mx-auto relative z-1">
          <div>
            <h4 className="text-[#FE6847] text-bold text-xl 3xl:text-4xl">
              {translation?.subTitle}
            </h4>
            <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 3xl:mt-12 leading-10 text-[#232F37]">
              {translation?.title}
            </h2>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl  mt-4 lg:mt-16 3xl:mt-20  text-[#515151] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
              {translation?.paragraph}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
