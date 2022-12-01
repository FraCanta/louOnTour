import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
const ModalGallery = ({ handleModal, showModal, imageArray }) => {
  return (
    <div
      className={`flex items-center justify-center w-screen h-screen fixed top-0 left-0 bottom-0 right-0 z-20 bg-black bg-opacity-40 overlay ${showModal?.isOpen} `}
    >
      <div
        className="right-[30px] top-[30px] absolute text-2xl z-50 text-white cursor-pointer"
        onClick={() => handleModal(showModal?.img)}
      >
        <Icon icon="material-symbols:close" color="white" width="40" />{" "}
      </div>
      <div
        className={`w-full h-full rounded-[10px] text-black flex flex-col justify-center  items-center border-none   bg-clip-padding text-current bg-modal ${showModal?.scale} bold`}
      >
        {imageArray?.map((el, i) => (
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
              console.log("preload" + el + " completato");
            }}
            onClick={() => handleModal(showModal?.img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModalGallery;
