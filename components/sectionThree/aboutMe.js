import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "../button/button";
import Modal from "../modal/modal";
import Swiper from "swiper";

const AboutMe = () => {
  // useEffect(() => {
  //   var swiper = new Swiper(".blog-slider", {
  //     spaceBetween: 30,
  //     effect: "fade",
  //     loop: true,
  //     mousewheel: {
  //       invert: false,
  //     },
  //     // autoHeight: true,
  //     pagination: {
  //       el: ".blog-slider__pagination",
  //       clickable: true,
  //     },
  //   });
  // });
  return (
    <div className="about_me min-h-[100vh]  container mx-auto w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-6 md:gap-14 xl:gap-28 grid-cols-1 lg:grid-cols-2  items-center w-4/5 mx-auto h-full">
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
        <div className="blog-slider">
          <div className="blog-slider__wrp swiper-wrapper">
            <div className="blog-slider__item swiper-slide">
              <div className="blog-slider__img">
                {/* <img src="../assets/Toscana.png" alt="" /> */}
              </div>
              {/* <div class="blog-slider__content"> */}
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
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
