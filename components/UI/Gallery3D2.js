import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { EffectCoverflow } from "swiper/modules";
import Image from "next/image";

const Gallery3d2 = ({ imageArray }) => {
  return (
    <div className="w-full lg:w-11/12 mx-auto py-20">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 100,
          depth: 150,
          modifier: 1.5,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        className="swiper_container"
      >
        {imageArray?.map((el, i) => (
          <SwiperSlide className="swiper_slide relative" key={i}>
            <Image src={el.src} alt="foto" fill />
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default Gallery3d2;
