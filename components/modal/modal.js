import Link from "next/link";
import React, { useRef, useEffect } from "react";
// import Florence from "../../public/assets/florence.mp4";
import { Icon } from "@iconify/react";
const Modal = ({ showModal, closeModal }) => {
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-20 bg-gray-900 bg-opacity-40 overlay ${showModal.isOpen} `}
      onClick={closeModal}
    >
      <div
        className={`w-[330px] h-[300px] 2xl:w-[660px] 2xl:h-[600px] fxl:w-[725px] fxl:h-[708px] rounded-[10px] text-black flex flex-col  items-end border-none shadow-lg bg-black bg-clip-padding text-current drop-shadow-lg bg-modal ${showModal.scale} bold`}
      >
        <div className="w-full h-full relative">
          <video autoPlay muted loop id="myVideo">
            <source src="../assets/florence.mp4" type="video/mp4" />
          </video>
          {/* <button className="absolute top-1/2 right-1/2 translate-x-1/2">
            <Icon
              icon="ant-design:play-circle-filled"
              color="white"
              width="50"
            />
          </button> */}
        </div>

        {/* <h3 className="uppercase text-white 2xl:text-6xl mb-4">
          {showModal.place}
        </h3>

        <Link
          href=""
          className="text-bold text-white uppercase 2xl:text-2xl underline"
        >
          Scopri
        </Link> */}
      </div>
    </div>
  );
};

export default Modal;
