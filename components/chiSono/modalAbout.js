import React, { useState } from "react";
import Image from "next/image";
import autoprefixer from "autoprefixer";

const ModalAbout = ({ handleModal, showModal, aboutme }) => {
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-20 bg-black bg-opacity-40 overlay ${showModal?.isOpen} `}
      onClick={() => handleModal(showModal?.img)}
    >
      <div
        className={`w-full h-full rounded-[10px] text-black flex flex-col justify-center  items-center border-none   bg-clip-padding text-current bg-modal ${showModal?.scale} bold`}
      >
        {aboutme?.map((el, i) => (
          <Image
            key={i}
            src={el}
            alt="foto"
            layout="fixed"
            width={1000}
            height={1000}
            style={
              showModal?.img === i
                ? { width: "auto", height: "90%", objectFit: "cover" }
                : { display: "none" }
            }
            onLoadingComplete={() => {
              console.log(el + " completato");
            }}
          />
        ))}
        {/* <Image
          src={showModal?.img}
          alt="foto"
          layout="fixed"
          width={1000}
          height={1000}
          style={{ width: "auto", height: "90%" }}
          // priority="true"
          // className="max-h-[80%] max-w-[80%]"
          onLoadingComplete={() => {
            console.log("ciao");
          }}
        /> */}
      </div>
    </div>
  );
};

export default ModalAbout;
