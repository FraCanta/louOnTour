import React, { useState, useEffect } from "react";
import Image from "next/image";
import ModalGallery from "./modalGallery";
import Spinner from "./spinner";

const GalleryTours = ({ imageArray }) => {
  const [showModal, setShowModal] = useState({
    isOpen: "hide",
    scale: "",
    img: null,
  });
  const [imgSpinner, setImgSpinner] = useState({});

  useEffect(() => {
    const arr = new Array(imageArray.length).fill(true);
    setImgSpinner({ ...arr });
  }, []);
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
            <div className="gallery-item" key={i}>
              <div
                className={`spinner-overlay h-full w-full relative `}
                style={
                  imgSpinner[i] ? { display: "block" } : { display: "none" }
                }
              >
                <Spinner />
              </div>
              <Image
                className={`gallery-image `}
                src={el}
                alt="foto"
                width={150}
                height={150}
                onClick={() => handleModal(i)}
                loading="lazy"
                onLoadingComplete={() =>
                  setImgSpinner((prevData) => {
                    return { ...prevData, [i]: false };
                  })
                }
              />
            </div>
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
