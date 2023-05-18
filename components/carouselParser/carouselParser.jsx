import React, { useEffect } from "react";
import parseHTML, { domToReact } from "html-react-parser";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import Image from "next/image";
import Script from "next/script";

const CarouselParser = ({ post }) => {
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + "gallery--click-to-next",
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
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  });
  useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "//www.instagram.com/embed.js");
    s.setAttribute("async", "true");
    document.head.appendChild(s);
  });
  return parseHTML(post, {
    replace: (domNode) => {
      if (
        domNode.type === "script" &&
        domNode.attribs.src === "//www.instagram.com/embed.js"
      ) {
        return (
          // <Script id="show-instagram" src="//www.instagram.com/embed.js" />
          <span></span>
        );
      }
      let arr = [];
      if (domNode.type === "tag" && domNode.name === "figure") {
        domNode.children.map((el, id) => {
          if (el.type === "tag" && el.name === "figure") {
            // console.log("ci sono due figure");
            arr.push({
              id: id,
              src: el?.children[0]?.attribs?.src,
              width: el?.children[0]?.attribs?.width,
              height: el?.children[0]?.attribs?.height,
              figcaption: el?.children[1]?.children[0]?.data,
            });
          } else if (el.type === "tag" && el.name === "img") {
            domNode.children.map(
              (el, id) =>
                el?.attribs?.src !== undefined &&
                arr.push({
                  id: id,
                  src: el.attribs.src,
                  figcaption: el?.next?.children[0]?.data,
                })
            );
          } else {
            return;
          }
        });

        if (arr.length > 0) {
          if (arr.length === 1) {
            return (
              <figure className="img-full">
                <img src={arr[0]?.src} alt="" />
                <figcaption>{arr[0]?.figcaption}</figcaption>
              </figure>
            );
          } else {
            // console.log(arr);
            return (
              <div
                className={`pswp-gallery ${
                  arr.length % 4 === 0 ? "gallery-img2" : "gallery-img"
                }`}
                id={"gallery--click-to-next"}
              >
                {arr?.map((image, index) => {
                  return (
                    <a
                      href={image.src}
                      data-pswp-width={image.width}
                      data-pswp-height={image.height}
                      key={"gallery--click-to-next" + "-" + index + image?.id}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <figure>
                        <figure>
                          <img src={image.src} alt="" />
                          <figcaption>{image?.figcaption}</figcaption>
                        </figure>
                      </figure>
                    </a>
                  );
                })}
              </div>
            );
          }
        } else {
          return;
        }
      }
    },
  });
};

export default CarouselParser;
