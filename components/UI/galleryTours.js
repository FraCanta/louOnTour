import React, { useState } from "react";
import Image from "next/image";
import ModalGallery from "./modalGallery";

const GalleryTours = ({ city }) => {
  const [showModal, setShowModal] = useState({
    isOpen: "hide",
    scale: "",
    img: "",
  });
  const handleModal = (img) => {
    showModal.isOpen === "hide"
      ? setShowModal({
          isOpen: "",
          scale: "scale-modal",
          img: img,
        })
      : setShowModal({
          isOpen: "hide",
          scale: "",
          img: img,
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
          {city?.gallery?.map((el, i) => (
            <>
              <div class="gallery-item" key={i}>
                <Image
                  className="gallery-image"
                  src={el}
                  alt={el?.titleImg}
                  priority
                  width={900}
                  height={900}
                  onClick={() => handleModal(el)}
                />
                <ModalGallery handleModal={handleModal} showModal={showModal} />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryTours;
