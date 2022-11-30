import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../modal/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Mousewheel, Autoplay } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import Image from "next/image";
import Cta from "../button/button";
import Link from "next/link";

const AboutMe = ({ translation }) => {
  console.log(translation);
  return (
    <div className="about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  py-8  w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 xl:grid-cols-2 justify-items-center content-center w-11/12 xl:w-4/5 mx-auto h-full">
        <div>
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl text-bold">
            About me
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  md:leading-none lg:leading-none mb-10">
            Che dicono di me!
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 text-white">
            Il fatto che tu stia cercando un tour per conoscere meglio un luogo
            fa di te una persona curiosa e questo, a me, piace moltissimo! Ma
            dal tuo punto di vista però, è anche vero che è importante trovare
            la guida giusta, con cui poter entrare in sintonia e apprezzare
            meglio l’esperienza. Facciamo così: nell’attesa di conoscerci meglio
            durante il nostro tour, dai un’occhiata qui e leggi cosa dicono di
            me.
          </p>
          <Link href="/chiSono">
            <Cta>scopri di più</Cta>
          </Link>
        </div>
        <div className="pt-40  xl:pt-[3rem]  flex items-center ">
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
              {translation?.map((el, i) => (
                <SwiperSlide className="blog-slider__item swiper-slide" key={i}>
                  <div className="blog-slider__img aspect-square">
                    <Image
                      src={el?.img_reviews}
                      alt="lou"
                      // width={300}
                      // height={300}
                      fill
                    />
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

            <div className="blog-slider__pagination"></div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
