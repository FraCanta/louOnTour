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
    <div className="about_me min-h-[70vh] container mx-auto w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-14 md:gap-14 xl:gap-14 grid-cols-1 lg:grid-cols-2  items-center w-4/5 mx-auto">
        <div>
          <h4 className="text-[#E24750]">About me</h4>
          <h2 className="text-4xl md:text-[64px] font-medium  md:leading-none lg:leading-none mb-20">
            Che dicono di me!
          </h2>

          <Button>scopri di più</Button>
        </div>
        <div class="blog-slider">
          <div class="blog-slider__wrp swiper-wrapper">
            <div class="blog-slider__item swiper-slide">
              <div class="blog-slider__img">
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
                  <span class="blog-slider__code">26 December 2019</span>
                  <div class="blog-slider__title">Lorem Ipsum Dolor</div>
                  <div class="blog-slider__text">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae voluptate repellendus magni illo ea animi?{" "}
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="blog-slider__item swiper-slide">
              <div class="blog-slider__img">
                <img
                  src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/jason-leung-798979-unsplash.webp"
                  alt=""
                />
              </div>
              <div class="blog-slider__content">
                <span class="blog-slider__code">26 December 2019</span>
                <div class="blog-slider__title">Lorem Ipsum Dolor2</div>
                <div class="blog-slider__text">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Recusandae voluptate repellendus magni illo ea animi?
                </div>
                <a href="#" class="blog-slider__button">
                  READ MORE
                </a>
              </div>
            </div>

            <div class="blog-slider__item swiper-slide">
              <div class="blog-slider__img">
                <img
                  src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/alessandro-capuzzi-799180-unsplash.webp"
                  alt=""
                />
              </div>
              <div class="blog-slider__content">
                <span class="blog-slider__code">26 December 2019</span>
                <div class="blog-slider__title">Lorem Ipsum Dolor</div>
                <div class="blog-slider__text">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Recusandae voluptate repellendus magni illo ea animi?
                </div>
                <a href="#" class="blog-slider__button">
                  READ MORE
                </a>
              </div>
            </div> */}
          </div>
          <div class="blog-slider__pagination"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
