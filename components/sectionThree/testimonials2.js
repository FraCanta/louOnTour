import React, { useRef } from "react";
import { Swiper } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import TestimonialCard from "./testimonialCard";

const Testimonials2 = ({ translation }) => {
  const swiperRef = useRef();
  return (
    <div className="wrapper">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        loop={true}
        autoHeight={false}
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          el: "swiper-pagination",
        }}
      >
        <div className="swiper-wrapper">
          {translation?.reviews?.map((el, i) => (
            <TestimonialCard i={i} review={el} key={i} />
          ))}
        </div>

        <div className="swiper-nav-wrapper">
          <div className="swiper-button-prev"></div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-next"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Testimonials2;
