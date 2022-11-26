import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../modal/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Mousewheel } from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import Lou from "../../public/assets/foto1.jpg";
import Lou2 from "../../public/assets/foto2.jpg";
import Lou3 from "../../public/assets/foto3.jpg";
import Lou4 from "../../public/assets/foto4.jpg";
import Image from "next/image";
import Cta from "../button/button";
import Link from "next/link";

const AboutMe = () => {
  return (
    <div className="about_me min-h-[100vh] py-8  w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 lg:grid-cols-2 justify-items-center content-center w-11/12 lg:w-4/5 mx-auto h-full">
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
        <div className="pt-20 2xl:pt-0 flex items-center ">
          <Swiper
            className="blog-slider"
            spaceBetween={30}
            effect={"fade"}
            pagination={{
              el: ".blog-slider__pagination",
              clickable: true,
            }}
            modules={[EffectFade, Pagination, Mousewheel]}
          >
            <div className="blog-slider__wrp swiper-wrapper">
              <SwiperSlide className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <Image src={Lou} alt="lou" />
                </div>
                <div className="flex flex-col lg:flex-col">
                  <div>
                    <span className="blog-slider__code">26 December 2019</span>
                    <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                    <div className="blog-slider__text">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Recusandae voluptate repellendus magni illo ea animi?{" "}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <Image src={Lou2} alt="lou" />
                </div>
                <div className="flex flex-col lg:flex-col">
                  <div>
                    <span className="blog-slider__code">26 December 2019</span>
                    <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                    <div className="blog-slider__text">
                      {" "}
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Recusandae voluptate repellendus magni illo ea animi?{" "}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <Image src={Lou3} alt="lou" />
                </div>
                <div className="flex flex-col lg:flex-col">
                  <div>
                    <span className="blog-slider__code">26 December 2019</span>
                    <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                    <div className="blog-slider__text">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Recusandae voluptate repellendus magni illo ea animi?{" "}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </div>
            <div className="blog-slider__pagination"></div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
