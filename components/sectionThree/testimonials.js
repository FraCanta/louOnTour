import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Mousewheel, Autoplay } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import Image from "next/image";

const Testimonials = ({ translation }) => {
  return (
    <Swiper
      className="blog-slider"
      spaceBetween={30}
      effect={"fade"}
      pagination={{
        el: ".blog-slider__pagination",
        clickable: true,
      }}
      modules={[EffectFade, Pagination, Mousewheel, Autoplay]}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      autoHeight={true}
    >
      <div className="blog-slider__wrp swiper-wrapper">
        {translation?.reviews.map((el, i) => (
          <SwiperSlide className="blog-slider__item swiper-slide" key={i}>
            <div className="blog-slider__img aspect-square">
              <Image src={el?.img_reviews} alt="lou" width={300} height={300} />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">{el?.date}</span>
              <div className="blog-slider__title flex items-center justify-center xl:justify-start">
                <div className="avatar placeholder mr-2">
                  <div className="w-8 rounded-full ring ring-[#fe6847] ">
                    <span className="text-xs">{el?.avatar}</span>
                  </div>
                </div>
                {el?.name}
              </div>
              <div className="blog-slider__text ">
                <p className="line-clamp">{el?.reviews_desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </div>

      {/* <div className="blog-slider__pagination"></div> */}
    </Swiper>
  );
};

export default Testimonials;
