import React from "react";
import Image from "next/image";
import Choose from "../../public/assets/choose.svg";
import Button from "../button/button";

const Map = () => {
  return (
    <div className="h-[50vh]  pt-20 container mx-auto w-4/5">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 md:grid-cols-2 justify-items-center content-center pt-60 lg:pt-12 pb-12">
        <div>
          <h4 className="text-[#5D68A6]">Tours</h4>
          <h2 className="text-4xl md:text-[64px] font-medium mt-2 leading-10 lg:leading-none">
            Disegnamo insieme il Tou Tour
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
          <Button>Contattami</Button>
        </div>
        <div className="flex flex-col absolute top-100 right-16">
          <Image src={Choose} alt="brand" width={120} height={120} />
          <h3 className="uppercase bold pt-2 text-lg">
            Scegli la tua Destinazione!
          </h3>
        </div>

        <div className="bg-toscana overflowBg relative"></div>
      </div>
    </div>
  );
};

export default Map;
