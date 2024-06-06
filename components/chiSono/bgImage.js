import React from "react";

const BgImage = ({ translation }) => {
  return (
    <>
      <div className="bgImage w-full xl:w-4/5 mx-auto "></div>
      <div className="text-left 2xl:text-center w-4/5 mx-auto py-10">
        <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl    text-para  mx-auto">
          {translation?.finalP}
        </p>
      </div>
    </>
  );
};

export default BgImage;
