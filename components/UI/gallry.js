import React from "react";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Gallry = ({ imageArray }) => {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  return (
    <LightGallery onInit={onInit} speed={500} plugins={[lgThumbnail, lgZoom]}>
      {imageArray?.map((el, i) => (
        <a href={el} key={i}>
          <img alt="img1" src={el} />
        </a>
      ))}
    </LightGallery>
  );
};

export default Gallry;
