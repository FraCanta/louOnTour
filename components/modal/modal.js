import Link from "next/link";
import React from "react";

const Modal = ({ place, closeModal }) => {
  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 z-20 bg-gray-900 bg-opacity-40"
      onClick={closeModal}
    >
      <div className="w-[330px] h-[300px] 2xl:w-[660px] 2xl:h-[600px]  fxl:w-[725px] fxl:h-[708px] rounded-[10px] absolute top-1/2 right-1/2 translate-x-2/4 -translate-y-2/4 text-black flex flex-col  items-end p-10 border-none shadow-lg bg-white bg-clip-padding text-current drop-shadow-lg">
        <p className="uppercase">{place}</p>
        <Link href="">Scopri</Link>
      </div>
    </div>
  );
};

export default Modal;
