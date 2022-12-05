import Image from "next/image";
import React from "react";
import Avatar from "../../public/assets/avatar/donnaAvatar.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { Icon } from "@iconify/react";

const Testimonials2 = ({ translation }) => {
  const starsArray = (rating) => new Array(rating).fill(1); //trasformo il numero in array per mapparlo

  return (
    <div className="wrapper">
      <Swiper
        spaceBetween={30}
        loop={true}
        autoHeight={false}
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={true}
        pagination={{
          el: "swiper-pagination",
        }}
      >
        <div className="swiper-wrapper">
          {translation?.map((el, i) => (
            <SwiperSlide key={i}>
              <div className="content-wrapper">
                <div className="content">
                  <div className="flex items-center">
                    <div className="avatar placeholder mr-2">
                      <div className="w-8 rounded-full ring ring-[#fe6847] ">
                        <span className="text-xs">{el?.avatar}</span>
                      </div>
                    </div>
                    <p className="ml-2"> {el?.name} </p>
                  </div>

                  <div className="flex items-center">
                    {starsArray(translation.rating).map((star, i) => (
                      <a key={i}>
                        <Icon
                          icon="ant-design:star-filled"
                          color="#ffe600"
                          width="20"
                          key={star}
                        />
                      </a>
                    ))}
                    <span className=" py-4 px-4">{el?.date}</span>
                  </div>

                  <p className="line-clamp">{el?.reviews_desc}</p>
                </div>
              </div>
            </SwiperSlide>
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
