import React from "react";
import { MaskText } from "../UI/MaskText";

const Text = ({ translation }) => {
  return (
    <div className="text-left 2xl:text-center mt-10 lg:py-20  flex items-center justify-center ">
      <div className="container w-11/12 mx-auto ">
        <div className="mx-auto relative flex flex-col gap-4">
          <MaskText>
            <h2 className="text-4xl md:text-5xl font-bold   text-principle">
              {translation?.secondTitle}
            </h2>
          </MaskText>
          <p className="text-xl sm:text-lg 2xl:text-xl fxl:text-2xl    text-para">
            {translation?.secondPa}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Text;
