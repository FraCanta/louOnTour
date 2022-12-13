import React, { useState, useEffect } from "react";
import ModalGallery from "./modalGallery";
import GalleryImage from "./galleryImage";

const GalleryTours = ({ imageArray }) => {
  const [showModal, setShowModal] = useState({
    isOpen: "hide",
    scale: "",
    img: null,
  });

  const handleModal = (imgToShow) => {
    showModal.isOpen === "hide"
      ? setShowModal({
          isOpen: "",
          scale: "scale-modal",
          img: imgToShow,
        })
      : setShowModal((prevData) => {
          return { ...prevData, isOpen: "hide", scale: "" };
        });
  };

  return (
    <div className="min-h-[50vh] ">
      <div className="container mx-auto w-11/12 lg:w-4/5 py-10">
        <h3 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] lg:text-center pb-4">
          Gallery
        </h3>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>

        <div className="gallery pt-8">
          {imageArray?.map((el, i) => (
            <GalleryImage url={el} handleModal={handleModal} key={i} item={i} />
          ))}
          <ModalGallery
            handleModal={handleModal}
            showModal={showModal}
            imageArray={imageArray}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryTours;
