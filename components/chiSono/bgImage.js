import Image from "next/image";
import React from "react";

const BgImage = ({ translation }) => {
  return (
    <>
      <div className="grid w-11/12 gap-6 mx-auto my-10 lg:grid-cols-2">
        <div>
          <p className="mx-auto text-lg lg:w-4/5 text-para ">
            {translation?.finalP}
          </p>
        </div>
        <div className="relative h-full aspect-video">
          <Image
            src="/assets/lou.jpg"
            alt="bgImage"
            fill
            className="object-cover w-full h-full aspect-video"
          />
        </div>
      </div>
    </>
  );
};

export default BgImage;
