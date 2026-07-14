import Image from "next/image";
import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const DEFAULT_IMAGE_WIDTH = 1600;
const DEFAULT_IMAGE_HEIGHT = 1067;
const MAX_VISIBLE_IMAGES = 5;

function normalizeImage(image) {
  if (typeof image === "string") {
    return {
      src: image,
      width: DEFAULT_IMAGE_WIDTH,
      height: DEFAULT_IMAGE_HEIGHT,
    };
  }

  return {
    src: image?.src || "",
    width: Number(image?.width) || DEFAULT_IMAGE_WIDTH,
    height: Number(image?.height) || DEFAULT_IMAGE_HEIGHT,
  };
}

export default function TourGalleryLightbox({
  images = [],
  title = "",
  locale = "it",
}) {
  const galleryImages = images.map(normalizeImage).filter((image) => image.src);

  useEffect(() => {
    if (!galleryImages.length) {
      return undefined;
    }

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#tour-gallery-lightbox",
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
      showAnimationDuration: 500,
      hideAnimationDuration: 400,
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [galleryImages.length]);

  if (!galleryImages.length) {
    return (
      <p className="text-sm text-para">
        {locale === "en" ? "No images available." : "Nessuna immagine disponibile."}
      </p>
    );
  }

  const visibleImages = galleryImages.slice(0, MAX_VISIBLE_IMAGES);
  const hiddenImages = galleryImages.slice(MAX_VISIBLE_IMAGES);
  const hiddenCount = hiddenImages.length;
  const moreLabel = locale === "en" ? "More photos" : "Altre foto";

  return (
    <div
      id="tour-gallery-lightbox"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {visibleImages.map((image, index) => {
        const isMoreTile = hiddenCount > 0 && index === visibleImages.length - 1;

        return (
          <a
            key={`${image.src}-${index}`}
            href={image.src}
            target="_blank"
            rel="noreferrer"
            data-pswp-width={image.width}
            data-pswp-height={image.height}
            className={`group relative overflow-hidden rounded-md ${
              index === 0 ? "h-[260px] sm:col-span-2" : "h-[180px]"
            }`}
            aria-label={
              isMoreTile
                ? `${moreLabel}: ${hiddenCount}`
                : locale === "en"
                  ? `Open gallery image ${index + 1}`
                  : `Apri immagine galleria ${index + 1}`
            }
          >
            <Image
              src={image.src}
              alt={`${title} ${index + 1}`}
              fill
              sizes={
                index === 0
                  ? "(max-width: 640px) 100vw, 50vw"
                  : "(max-width: 640px) 100vw, 25vw"
              }
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 transition bg-black/0 group-hover:bg-black/20" />
            {isMoreTile ? (
              <span className="absolute inset-0 flex flex-col items-center justify-center bg-[#2c395b]/70 px-4 text-center text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {moreLabel}
                </span>
                <span className="mt-2 text-3xl font-bold">+{hiddenCount}</span>
              </span>
            ) : null}
          </a>
        );
      })}
      {hiddenImages.map((image, index) => (
        <a
          key={`${image.src}-hidden-${index}`}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}
    </div>
  );
}
