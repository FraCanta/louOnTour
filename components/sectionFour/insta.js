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
      <div className="grid gap-4 md:gap-8 xl:gap-18 grid-cols-1 2xl:grid-cols-2 justify-items-center content-center pt-0 lg:pt-8 py-8">
        <div className="pt-0 h-full whitespace-nowrap overflow-x-auto overflow-y-hidden w-full">
          <Masonry />
        </div>
        <div className="md:hidden carousel carousel-center p-4 space-x-4 ">
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
        <div className=" 2xl:p-0 w-11/12 2xl:w-4/5 flex flex-col items-start justify-center">
          <h3 className="text-[#FE6847] font-bold text-xl 3xl:text-4xl">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-6xl 3xl:text-[100px] font-bold  text-[#2C395B]">
              {translation?.title}
            </h2>
          </MaskText>

          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl  mt-4 sm:mt-10 mb-8 text-para">
            {translation?.paragraph}
          </p>
          <CtaPrimary
            link="https://www.instagram.com/luisatourguide__/"
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
