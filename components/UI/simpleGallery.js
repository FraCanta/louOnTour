import React, { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import GalleryImage from "./galleryImage";

export default function SimpleGallery({ imageArray, galleryID, galleryTitle }) {
  useEffect(() => {
    const backEasing = {
      in: "cubic-bezier(0.6, -0.28, 0.7, 1)",
      out: "cubic-bezier(0.3, 0, 0.32, 1.275)",
      inOut: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    };
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
      padding: { top: 20, bottom: 20, left: 10, right: 10 },
      mainClass: "pswp--custom-bg",
      showHideAnimationType: "zoom",
      showAnimationDuration: 800,
      hideAnimationDuration: 800,
    });

    lightbox.on("firstUpdate", () => {
      lightbox.pswp.options.easing = backEasing.out;
    });
    lightbox.on("initialZoomInEnd", () => {
      lightbox.pswp.options.easing = backEasing.inOut;
    });
    lightbox.on("close", () => {
      lightbox.pswp.options.easing = backEasing.in;
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
        <h2 className="text-3xl md:text-4xl font-bold mt-2 leading-10 text-[#2C395B] lg:text-center pb-4">
          {galleryTitle}
        </h2>
        <div className="w-full h-[1px] bg-black bg-opacity-20"></div>

        <div className="gallery pt-8 pswp-gallery " id={galleryID}>
          {imageArray?.map((el, i) => (
            <a
              href={el?.src}
              data-pswp-width={el?.width}
              data-pswp-height={el?.height}
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
