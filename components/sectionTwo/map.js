import React from "react";
import Image from "next/image";
import Toscana from "../../public/assets/toscana.svg";
import Choose from "../../public/assets/choose.svg";
import { Icon } from "@iconify/react";

import Button from "../button/button";

const Map = () => {
  return (
    <div className="h-[100vh] container mx-auto w-4/5 relative">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 lg:grid-cols-2 justify-items-center content-center pt-60 lg:pt-10 pb-12">
        <div>
          <h4 className="text-[#5D68A6]">Tours</h4>
          <h2 className="text-4xl md:text-[64px] font-medium mt-2 md:leading-none lg:leading-none">
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
        <div className="pt-0 w-[700px] ">
          <Image
            src={Toscana}
            alt="brand"
            width={700}
            height={700}
            className="overflow-x-hidden"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute top-64 right-40"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute top-80 right-60"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-60 right-32"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-80 right-44"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-40 right-44"
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-64 right-72"
          />

          {/* <div className="flex justify-end text-end">
            <Image src={Choose} alt="brand" width={70} height={70} />

            <h3 className="uppercase bold pt-10 text-lg  text-[0.8rem] 2xl:text-[0.5rem]">
              Scegli la tua Destinazione!
            </h3>
          </div> */}
        </div>

        {/* <div className="bg-toscana overflowBg absolute top-[59rem]  2xl:top-44 -right-[6.5rem] 2xl:right-2"></div> */}
      </div>
    </div>
  );
};

export default Map;
