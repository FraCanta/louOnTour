import React, { useState } from "react";
import Slider from "react-slick";
import { Icon } from "@iconify/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewModal from "./ReviewModal";

const TestimonialsCarousel = ({ translation }) => {
  const [activeReview, setActiveReview] = useState(null);

  const starsArray = (rating) => new Array(rating).fill(1);

  const settings = {
    infinite: true,
    speed: 5000, // durata dello scorrimento in ms
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // parte subito senza pause
    cssEase: "linear", // movimento continuo
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  return (
    <>
      <div
        className="
[mask-image:linear-gradient(to_right,#0000_0%,#fff_3%,#fff_97%,#0000_100%)]
[-webkit-mask-image:linear-gradient(to_right,#0000_0%,#fff_3%,#fff_97%,#0000_100%)]
"
      >
        <Slider {...settings}>
          {translation.reviews.map((testimonial, index) => (
            <div key={index} className="p-2">
              <div className="testimonial h-[26rem] qhd:h-[34rem] flex flex-col justify-between bg-[#fffaf7] p-4 qhd:p-6">
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
                  <p className="text-lg qhd:text-2xl qhd:leading-9 line-clamp text-para">
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
                <p className="text-sm qhd:text-lg font-bold uppercase text-principle/80">
                  {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

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
