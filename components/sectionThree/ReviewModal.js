import { useEffect } from "react";
import { Icon } from "@iconify/react";

const ReviewModal = ({ review, onClose }) => {
  // 🔑 Chiudi con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-principle/60"
      onClick={onClose} // 👈 click overlay
    >
      {/* MODAL */}
      <div
        className="relative w-full max-w-xl p-6 bg-white rounded-xl"
        onClick={(e) => e.stopPropagation()} // 👈 blocca bubbling
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute text-xl font-bold top-5 right-6 text-principle"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* STARS */}
        <div className="flex my-10">
          {Array(review.rating)
            .fill(0)
            .map((_, i) => (
              <Icon
                key={i}
                icon="material-symbols-light:star"
                className="text-principle"
                width="28"
              />
            ))}
        </div>

        {/* TEXT */}
        <p className="mb-6 text-lg leading-relaxed text-principle">
          {review.reviews_desc}
        </p>

        {/* AUTHOR */}
        <p className="text-sm font-bold uppercase text-principle/80">
          {review.name}
        </p>
      </div>
    </div>
  );
};

export default ReviewModal;
