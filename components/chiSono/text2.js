import React from "react";
import { MaskText } from "../UI/MaskText";
import Image from "next/image";

const Text2 = ({ translation }) => {
  return (
    <div className="grid items-center justify-center w-11/12 qhd:max-w-[2304px] gap-10 qhd:gap-20 mx-auto mt-10 qhd:mt-20 lg:grid-cols-2 lg:py-20 qhd:py-28">
      <div className="relative flex flex-col gap-4 mx-auto qhd:gap-7 lg:w-4/5">
        <MaskText>
          <h2
            dangerouslySetInnerHTML={{
              __html: translation?.thirdTitle,
            }}
            className="text-3xl font-bold md:text-6xl qhd:text-[5rem] qhd:leading-[5.6rem] text-principle"
          ></h2>
        </MaskText>
        {translation?.thirdPa &&
          translation?.thirdPa.map((paragraph, index) => (
            <p
              key={index}
              className="text-base lg:text-lg qhd:text-2xl qhd:leading-10 text-para"
            >
              {paragraph}
            </p>
          ))}
      </div>
      <div className="relative h-full aspect-square">
        <Image
          src="/assets/donna_sorridente_sumattoni.webp"
          alt="donna sorridente"
          fill
          className="object-cover w-full h-full aspect-square"
        />
      </div>
    </div>
  );
};

export default Text2;
