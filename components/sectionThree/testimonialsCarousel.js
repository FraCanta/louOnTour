import React, { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Icon } from "@iconify/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewModal from "./ReviewModal";

const TestimonialsCarousel = ({ translation }) => {
  const [activeReview, setActiveReview] = useState(null);

  const starsArray = (rating) => new Array(rating).fill(1);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  return (
    <>
      <Slider {...settings}>
        {translation.reviews.map((testimonial, index) => (
          <div key={index} className="p-2">
            <div className="testimonial h-[26rem] flex flex-col justify-between bg-white/80 p-4">
              {/* STARS */}
              <div className="flex">
                {starsArray(testimonial.rating).map((_, i) => (
                  <Icon
                    key={i}
                    icon="material-symbols-light:star"
                    className="text-principle"
                    width="26"
                  />
                ))}
              </div>

              {/* TEXT */}
              <div className="flex flex-col justify-center flex-grow h-full gap-2">
                <p className="text-lg line-clamp text-principle">
                  {testimonial.reviews_desc}
                </p>

                {testimonial.reviews_desc.length > 200 && (
                  <button
                    onClick={() => setActiveReview(testimonial)}
                    className="self-start text-sm font-semibold text-principle hover:underline"
                  >
                    Leggi di +
                  </button>
                )}
              </div>

              {/* AUTHOR */}
              <p className="text-sm font-bold uppercase text-principle/80">
                {testimonial.name}
              </p>
            </div>
          </div>
        ))}
      </Slider>

      {/* MODALE */}
      {activeReview && (
        <ReviewModal
          review={activeReview}
          onClose={() => setActiveReview(null)}
        />
      )}
    </>
  );
};

export default TestimonialsCarousel;
