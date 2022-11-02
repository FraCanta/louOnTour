import React, { useState } from "react";
import Image from "next/image";
import Toscana from "../../public/assets/toscana.svg";
import Choose from "../../public/assets/choose.svg";
import { Icon } from "@iconify/react";

import Button from "../button/button";
import Modal from "../modal/modal";

const Map = () => {
  const [showModal, setShowModal] = useState({
    isOpen: "hide",
    place: null,
    scale: "",
  });
  const openModal = (place) => {
    setShowModal({ isOpen: "", place: place, scale: "scale-modal" });
  };
  const closeModal = () => {
    setShowModal((prevData) => {
      return { ...prevData, isOpen: "hide", scale: "" };
    });
  };
  return (
    <div className="min-h-[70vh] container mx-auto w-full 2xl:w-4/5  ">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 2xl:grid-cols-2 justify-items-center content-center pt-8 lg:pt-10 pb-12 overflow-x-hidden">
        <div className="w-4/5 2xl:w-full">
          <h4 className="text-[#5D68A6]">Tours</h4>
          <h2 className="text-4xl md:text-[64px] font-medium mt-2 md:leading-none lg:leading-none">
            Disegnamo insieme il Tuo Tour
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
        <div className="pt-0 w-[700px] height-[697.359px] relative ">
          <Image src={Toscana} alt="brand" width={700} height={697.359} />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute top-[256px] right-[240px] animate-bounce"
            onClick={() => openModal("Firenze")}
            id="Firenze"
          />
          <Modal showModal={showModal} closeModal={closeModal} />

          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute top-[320px] right-[320px] animate-bounce"
            id="SanGimignano"
            onClick={() => openModal("San Gimignano")}
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-[240px] right-[208px] animate-bounce"
            id="Siena"
            onClick={() => openModal("Siena")}
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-[293px] right-[256px] animate-bounce"
            id="Monteriggioni"
            onClick={() => openModal("Monteriggioni")}
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-[160px] right-[256px] animate-bounce"
            id="SanGalgano"
            onClick={() => openModal("San Galgano")}
          />
          <Icon
            icon="fontisto:map-marker-alt"
            color="#e3494d"
            width="40"
            className="absolute bottom-[272px] right-[352px] animate-bounce"
            id="Volterra"
            onClick={() => openModal("Volterra")}
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
