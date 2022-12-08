import Image from "next/image";
import React, { useState } from "react";
import Avatar from "../../public/assets/avatar/donnaAvatar.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { Icon } from "@iconify/react";

const Testimonials2 = ({ translation }) => {
  const starsArray = (rating) => new Array(rating).fill(1); //trasformo il numero in array per mapparlo
  const [expandText, setExpandText] = useState("line-clamp");
  const handleReadMore = () => {
    if (expandText === "line-clamp") {
      setExpandText("box-folded--expanded ");
    } else {
      setExpandText("line-clamp");
    }
  };
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
        // autoplay={true}
        pagination={{
          el: "swiper-pagination",
        }}
      >
        <div className="swiper-wrapper">
          {translation?.reviews?.map((el, i) => (
            <SwiperSlide key={i}>
              <div className="content-wrapper">
                <div className="content">
                  <div className="flex items-center w-full justify-between py-4 px-4">
                    <div className="flex items-center">
                      <div className="avatar placeholder mr-2">
                        <div className="w-8 rounded-full ring ring-[#fe6847] ">
                          <span className="text-xs text-[#fe6847]">
                            <Image
                              src={el?.img_reviews}
                              width={20}
                              height={20}
                              alt="avatar"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="text-md text-[#fe6847] font-bold ml-2 flex flex-col items-start">
                        {el?.name}
                        <div className="flex">
                          {starsArray(el?.rating).map((star, i) => (
                            <a key={i}>
                              <Icon
                                icon="ant-design:star-filled"
                                color="#ffe600"
                                width="15"
                                key={star}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <span className="text-[#232F37] text-xs py-4 px-4 font-bold">
                      {el?.date}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`${expandText} text-[#232F37] text-[0.9rem]`}
                    >
                      {el?.reviews_desc}
                    </span>
                  </div>
                  <span class="box-folded__trigger" onClick={handleReadMore}>
                    + read more
                  </span>
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
