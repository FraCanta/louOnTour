import React from "react";
import Image from "next/image";
import Toscana from "../../public/assets/Toscana.png";

const Map = () => {
  return (
    <div className="h-[50vh]  pt-20 container mx-auto w-4/5">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 md:grid-cols-2 justify-items-center content-center pt-60 pb-12">
        <div>
          <h4 className="text-[#5D68A6]">Tours</h4>
          <h2 className="text-4xl md:text-[64px] font-medium mt-2 leading-10">
            Welcome to Lou On Tour
          </h2>
          <p className="text-base sm:text-lg  mt-4 sm:mt-16 mb-8 text-[#2d2d2d] ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <Image
          src={Toscana}
          alt="brand"
          width={600}
          height={600}
          className="brand-img rounded-lg"
        />
      </div>
    </div>
  );
};

export default Map;
