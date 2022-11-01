import Link from "next/link";
import React from "react";

const Modal = ({ showModal, closeModal }) => {
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 z-20 bg-gray-900 bg-opacity-40 overlay ${showModal.isOpen} `}
      onClick={closeModal}
    >
      <div
        className={`w-[330px] h-[300px] 2xl:w-[660px] 2xl:h-[600px] fxl:w-[725px] fxl:h-[708px] rounded-[10px] text-black flex flex-col  items-end p-10 border-none shadow-lg bg-white bg-clip-padding text-current drop-shadow-lg bg-modal ${showModal.scale} bold`}
      >
        <h3 className="uppercase text-white text-6xl mb-4">
          {showModal.place}
        </h3>
        <Link
          href=""
          className="text-bold text-white uppercase text-2xl underline"
        >
          Scopri
        </Link>
      </div>
    </div>
  );
};

export default Modal;
