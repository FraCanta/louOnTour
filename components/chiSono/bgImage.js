import React from "react";

const BgImage = ({ translation }) => {
  return (
    <>
      <div className="bgImage  w-11/12 xl:w-4/5 mx-auto "></div>
      <div className="text-left 2xl:text-center w-11/12 lg:w-4/5 mx-auto lg:py-10">
        <p className="text-xl sm:text-lg 2xl:text-xl fxl:text-2xl    text-para  mx-auto">
          {translation?.finalP}
        </p>
      </div>
    </>
  );
};

export default BgImage;
