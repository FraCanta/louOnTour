import React, { useState, useEffect } from "react";
import Spinner from "./spinner";
import Image from "next/image";

const GalleryImage = ({ url, item, handleModal }) => {
  const [imgSpinner, setImgSpinner] = useState(true);
  // useEffect(() => {
  //   console.log(url, imgSpinner);
  // }, [imgSpinner]);
  return (
    <div className="gallery-item">
      <div
        className={`spinner-overlay h-full w-full relative `}
        style={imgSpinner ? {} : { display: "none" }}
      >
        <Spinner />
      </div>
      <Image
        className={`gallery-image `}
        priority
        src={url}
        alt="foto"
        width={150}
        height={150}
        onClick={() => handleModal(item)}
        onLoadingComplete={() => {
          // console.log("Lo sto settando coglione!");
          setImgSpinner(false);
        }}
      />
    </div>
  );
};

export default GalleryImage;
