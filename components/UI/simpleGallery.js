import React, { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import GalleryImage from "./galleryImage";

export default function SimpleGallery({ imageArray, galleryID }) {
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
      children: "a",
      showHideAnimationType: "fade",
      imageClickAction: "next",
      tapAction: "next",
      pswpModule: () => import("photoswipe"),
      escKey: true,
      arrowKeys: true,
      loop: true,
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className="min-h-[50vh] ">
      <div className="container mx-auto w-11/12 lg:w-4/5 py-10">
        <h3 className="text-3xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] lg:text-center pb-4">
          Gallery
        </h3>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>

        <div className="gallery pt-8 pswp-gallery " id={galleryID}>
          {imageArray?.map((el, i) => (
            <a
              href={el}
              data-pswp-width={1500}
              data-pswp-height={2000}
              key={el.galleryID + "-" + i}
              // target="_blank"
              rel="noreferrer"
            >
              <GalleryImage url={el} key={i} item={i} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
