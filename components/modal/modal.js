import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
// import Florence from "../../public/assets/florence.mp4";
import { Icon } from "@iconify/react";
const Modal = ({ handleModal, showModal }) => {
  // useEffect(() => {
  //   document.body.classList.add("stop-scrolling");
  // }, []);

  return (
    <>
      <div
        className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-20 bg-[#232F37] bg-opacity-50 overlay ${showModal?.isOpen} `}
        onClick={() =>
          handleModal(showModal?.title, showModal?.video, showModal?.link)
        }
      >
        <div
          className={`min-w-[330px] min-h-[300px] 2xl:min-w-[660px] 2xl:min-h-[600px] fxl:min-w-[725px] fxl:min-h-[708px] rounded-[10px] text-black flex flex-col justify-center  items-center border-none shadow-lg bg-black bg-clip-padding text-current drop-shadow-lg bg-modal ${showModal?.scale} bold`}
        >
          <div className="w-full h-full relative">
            <video key={showModal?.video} autoPlay muted loop id="myVideo">
              <source src={showModal?.video} type="video/mp4" />
            </video>
          </div>

          <h3 className="uppercase text-white text-4xl 2xl:text-6xl mb-4 z-[999]">
            {showModal?.title}
          </h3>

          {showModal?.link.length > 0 && (
            <Link
              href={showModal?.link}
              className="text-bold text-white uppercase text-xl  2xl:text-2xl underline z-[999]"
            >
              Scopri
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
