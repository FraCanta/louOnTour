import Image from "next/image";
import React from "react";
import Avatar from "../../public/assets/avatar/donnaAvatar.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Mousewheel, Autoplay } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

const Testimonials2 = ({ translation }) => {
  return (
    <div className="wrapper">
      <Swiper
        spaceBetween={30}
        modules={Pagination}
        loop={true}
        autoHeight={false}
        pagination={{
          el: ".swiper-button-prev",
          clickable: true,
        }}
      >
        <div className="swiper-wrapper">
          {translation?.map((el, i) => (
            <SwiperSlide key={i}>
              <div className="content-wrapper">
                <div className="content">
                  <div className="swiper-avatar">
                    <Image
                      src={el?.img_reviews}
                      alt="lou"
                      width={300}
                      height={300}
                    />
                    <p className="py-4">- {el?.name} -</p>
                  </div>

                  <p className="line-clamp">{el?.reviews_desc}</p>
                  {/* <span>{el?.date}</span> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>

        <div className="swiper-nav-wrapper">
          <div className="swiper-button-prev"></div>
          {/* <div className="swiper-pagination"></div> */}
          <div className="swiper-button-next"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Testimonials2;
