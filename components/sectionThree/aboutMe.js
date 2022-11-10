import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "../button/button";
import Modal from "../modal/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Mousewheel } from "swiper";
import "swiper/css/bundle";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Lou from "../../public/assets/foto1.jpg";
import Lou2 from "../../public/assets/foto2.jpg";
import Lou3 from "../../public/assets/foto3.jpg";
import Lou4 from "../../public/assets/foto4.jpg";
import Image from "next/image";
import Script from "next/script";

const AboutMe = () => {
  return (
    <div className="about_me min-h-[100vh] py-8  w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 lg:grid-cols-2 justify-items-center content-center w-4/5 mx-auto h-full">
        <div>
          <h4 className="text-[#E3494D]">About me</h4>
          <h2 className="text-4xl md:text-[64px] font-medium  md:leading-none lg:leading-none mb-10">
            Che dicono di me!
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl  mb-8 text-white">
            Il fatto che tu stia cercando un tour per conoscere meglio un luogo
            fa di te una persona curiosa e questo, a me, piace moltissimo! Ma
            dal tuo punto di vista però, è anche vero che è importante trovare
            la guida giusta, con cui poter entrare in sintonia e apprezzare
            meglio l’esperienza. Facciamo così: nell’attesa di conoscerci meglio
            durante il nostro tour, dai un’occhiata qui e leggi cosa dicono di
            me.
          </p>

          <Button>scopri di più</Button>
        </div>
        <div className="pt-20 2xl:pt-0 flex items-center">
          {/* <div className="blog-slider ">
            <div className="blog-slider__wrp swiper-wrapper">
              <div className="blog-slider__item swiper-slide">
                <div className="blog-slider__img"></div>
                <div className="flex flex-col-reverse lg:flex-col">
                  <div className="flex  w-full text-black justify-end items-center mb-4">
                    <h6 className="mx-2 text-[0.8rem] text-[#707070]">
                      posted on
                    </h6>
                    <Icon icon="logos:airbnb" width="73" />
                  </div>
                  <div>
                    <span className="blog-slider__code">26 December 2019</span>
                    <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                    <div className="blog-slider__text">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Recusandae voluptate repellendus magni illo ea animi?{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-slider__pagination"></div>
          </div> */}

          <div
            className="airbnb-embed-frame w-[410px] h-[300px] mx-auto"
            data-id="3583595"
            data-view="experience"
            // style="width:410px;height:300px;margin:auto"
          >
            <a href="https://www.airbnb.it/experiences/3583595?guests=1&amp;adults=1&amp;s=66&amp;source=embed_widget">
              Visto su Airbnb
            </a>
            <a
              href="https://www.airbnb.it/experiences/3583595?guests=1&amp;adults=1&amp;s=66&amp;source=embed_widget"
              rel="nofollow"
            >
              Tour Privato a Siena con una Guida Turistica Abilitata
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
