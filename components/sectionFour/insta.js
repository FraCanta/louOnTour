import React from "react";
import Cta from "../button/CtaPrimary";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Lou from "../../public/assets/fotoinsta2.jpg";
import Lou2 from "../../public/assets/fotoinsta4.jpg";
import Lou3 from "../../public/assets/foto2.jpg";
import Lou4 from "../../public/assets/fotoinsta.jpg";
import Masonry from "./masonry";
import Link from "next/link";
import CtaPrimary from "../button/CtaPrimary";
import { MaskText } from "../UI/MaskText";

const Insta = ({ translation }) => {
  return (
    <div className="min-h-[38vh] lg:min-h-[40vh] 3xl:min-h-[80vh]  w-full 2xl:p-8 ">
      <div className="grid content-center grid-cols-1 gap-4 py-8 pt-0 md:gap-8 xl:gap-18 2xl:grid-cols-2 justify-items-center lg:pt-8">
        <div className="w-full h-full pt-0 overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <Masonry />
        </div>
        <div className="p-4 space-x-4 md:hidden carousel carousel-center ">
          <div className="carousel-item">
            <Image
              src={Lou}
              className="rounded-box  !w-[300px] !h-[300px]"
              alt=""
              quality={70}
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou2}
              className="rounded-box !w-[300px] !h-[300px]"
              alt=""
              quality={70}
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou3}
              className="rounded-box !w-[300px] !h-[300px]"
              alt=""
              quality={70}
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou4}
              className="rounded-box !w-[300px] !h-[300px]"
              alt=""
              quality={70}
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-11/12  2xl:p-0 2xl:w-4/5">
          <h3 className="text-[#FE6847] font-bold text-xl 3xl:text-4xl">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-6xl 3xl:text-[100px] font-bold  text-[#2C395B]">
              {translation?.title}
            </h2>
          </MaskText>

          <p className="mt-4 mb-8 text-xl sm:text-lg 2xl:text-xl fxl:text-2xl sm:mt-10 text-para">
            {translation?.paragraph}
          </p>
          <CtaPrimary
            link="https://www.facebook.com/luisa.quaglia.tourguide"
            target="_blank"
          >
            {translation?.button}
          </CtaPrimary>
        </div>
      </div>
    </div>
  );
};

export default Insta;
