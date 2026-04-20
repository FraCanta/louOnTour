import { useEffect } from "react";
import parseHTML from "html-react-parser";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import Image from "next/image";

const DEFAULT_IMAGE_WIDTH = 1600;
const DEFAULT_IMAGE_HEIGHT = 1067;

const parseDimension = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildImageData = (imageNode, id, figcaption) => {
  if (!imageNode?.attribs?.src) {
    return null;
  }

  return {
    id,
    src: imageNode.attribs.src,
    alt: imageNode.attribs.alt || "",
    width: parseDimension(imageNode.attribs.width, DEFAULT_IMAGE_WIDTH),
    height: parseDimension(imageNode.attribs.height, DEFAULT_IMAGE_HEIGHT),
    figcaption,
  };
};

const CarouselParser = ({ post }) => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery--click-to-next",
      children: "a",
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
    };
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="//www.instagram.com/embed.js"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("src", "//www.instagram.com/embed.js");
    script.setAttribute("async", "true");
    document.head.appendChild(script);
  }, []);

  return parseHTML(post, {
    replace: (domNode) => {
      if (
        domNode.type === "script" &&
        domNode.attribs?.src === "//www.instagram.com/embed.js"
      ) {
        return <span />;
      }

      if (domNode.type !== "tag" || domNode.name !== "figure") {
        return undefined;
      }

      const images = [];

      domNode.children.forEach((child, id) => {
        if (child.type === "tag" && child.name === "figure") {
          const imageNode = child.children.find(
            (nestedChild) =>
              nestedChild.type === "tag" && nestedChild.name === "img",
          );
          const captionNode = child.children.find(
            (nestedChild) =>
              nestedChild.type === "tag" && nestedChild.name === "figcaption",
          );
          const image = buildImageData(
            imageNode,
            id,
            captionNode?.children?.[0]?.data,
          );

          if (image) {
            images.push(image);
          }
        }

        if (child.type === "tag" && child.name === "img") {
          const image = buildImageData(
            child,
            id,
            child.next?.children?.[0]?.data,
          );

          if (image) {
            images.push(image);
          }
        }
      });

      if (images.length === 0) {
        return undefined;
      }

      if (images.length === 1) {
        const image = images[0];

        return (
          <figure className="img-full">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 1024px) 100vw, 97vw"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "97%",
                maxHeight: "815.625px",
                minWidth: "35.5556px",
                minHeight: "20px",
                borderRadius: "2px",
                margin: "0 auto",
              }}
            />
            {image.figcaption ? (
              <figcaption className="text-sm">{image.figcaption}</figcaption>
            ) : null}
          </figure>
        );
      }

      const isTwoColumnGallery =
        images.length % 4 === 0 || images.length % 2 === 0;

      return (
        <div
          className={`pswp-gallery ${
            isTwoColumnGallery ? "gallery-img2" : "gallery-img"
          }`}
          id="gallery--click-to-next"
        >
          {images.map((image, index) => (
            <a
              href={image.src}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              key={`gallery--click-to-next-${index}-${image.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <figure>
                <figure>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes={
                      isTwoColumnGallery
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 33vw"
                    }
                    style={{
                      width: "100%",
                      height: "600px",
                      objectFit: "cover",
                      objectPosition: "top",
                      borderRadius: "2px",
                    }}
                  />
                  {image.figcaption ? (
                    <figcaption className="text-sm">
                      {image.figcaption}
                    </figcaption>
                  ) : null}
                </figure>
              </figure>
            </a>
          ))}
        </div>
      );
    },
  });
};

export default CarouselParser;
