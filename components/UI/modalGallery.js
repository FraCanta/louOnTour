import React from "react";
import Image from "next/image";

const ModalCorrelati = ({ handleModal, showModal }) => {
  console.log(showModal?.gallery);
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-20 bg-black bg-opacity-20 overlay ${showModal?.isOpen} `}
      onClick={() => handleModal("")}
    >
      <div
        className={`w-full h-full rounded-[10px] text-black flex flex-col justify-center  items-center border-none   bg-clip-padding text-current bg-modal ${showModal?.scale} bold`}
      >
        <div className=" ">
          <Image
            src={showModal?.img}
            alt=""
            // objectFit="contain"
            // fill
            // priority
            width={700}
            height={700}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalCorrelati;
