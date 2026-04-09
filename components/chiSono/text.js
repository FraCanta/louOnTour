import React from "react";
import { MaskText } from "../UI/MaskText";

const Text = ({ translation }) => {
  return (
    <div className="grid items-center justify-center w-11/12 gap-10 mx-auto mt-10 lg:grid-cols-2 lg:py-20">
      <div className="relative flex flex-col gap-4 mx-auto lg:w-4/5">
        <MaskText>
          <h2 className="text-4xl font-bold md:text-6xl text-principle">
            {translation?.secondTitle}
          </h2>
        </MaskText>
        <p className="text-base lg:text-lg text-para">
          {translation?.secondPa}
        </p>
      </div>
      <div className="relative flex items-center justify-end w-full aspect-square">
        <video
          src="/assets/hero_tour2.mp4"
          autoPlay
          loop
          muted
          className="object-cover w-full h-full rounded-sm"
        />
      </div>
    </div>
  );
};

export default Text;
