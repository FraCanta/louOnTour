import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const Carousel = ({ translation }) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  return (
    <div className="s-slider" data-amount={3}>
      {/* Swiper */}
      <div className="s-swipers">
        <div className="s-swipers-inner">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop
            centeredSlides
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            speed={1200}
            navigation={{
              nextEl: ".s-swiper-nav-next",
              prevEl: ".s-swiper-nav-prev",
            }}
            pagination={{ clickable: true, el: ".swiper-pagination" }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.realIndex + 1);
            }}
            className="swiper"
            breakpoints={{
              360: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
            }}
          >
            {translation?.galleria?.map((el, i) => (
              <SwiperSlide key={i}>
                <figure className="relative w-full h-full media-wrapper">
                  <Image
                    src={el?.src}
                    alt={`Slide ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </figure>

                <div className="absolute left-0 flex items-center justify-center w-full bottom-6 lg:bottom-14">
                  <h2 className="text-2xl font-bold text-center text-white lg:text-4xl fxl:text-5xl">
                    {el.name}
                  </h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
