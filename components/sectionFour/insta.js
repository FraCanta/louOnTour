import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Lou from "../../public/assets/foto1.jpg";
import Lou2 from "../../public/assets/foto2.jpg";
import Lou3 from "../../public/assets/foto3.jpg";
import Lou4 from "../../public/assets/foto4.jpg";
import Masonry from "./masonry";

const Insta = () => {
  return (
    <div className="min-h-[100vh] container mx-auto w-full 2xl:p-8">
      <div className="grid gap-8 md:gap-32 xl:gap-18 grid-cols-1 2xl:grid-cols-2 justify-items-center content-center pt-8 ">
        <div className="pt-0 h-full whitespace-nowrap overflow-x-auto overflow-y-hidden w-full">
          <Masonry />
        </div>
        <div className="md:hidden carousel carousel-center p-4 space-x-4 ">
          <div className="carousel-item">
            <Image
              src={Lou}
              className="rounded-box  w-[300px] h-[300px]"
              alt=""
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou2}
              className="rounded-box w-[300px] h-[300px]"
              alt=""
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou3}
              className="rounded-box w-[300px] h-[300px]"
              alt=""
            />
          </div>
          <div className="carousel-item">
            <Image
              src={Lou4}
              className="rounded-box w-[300px] h-[300px]"
              alt=""
            />
          </div>
        </div>
        <div className=" 2xl:p-0 w-4/5 flex flex-col items-start justify-center">
          <h4 className="text-[#E3494D]">Social</h4>
          <h2 className="text-4xl md:text-[64px] font-medium md:leading-none lg:leading-none text-[#232F37]">
            Lou On Tour Instagram
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl  mt-4 sm:mt-10 mb-8 text-[#515151] ">
            L’aspetto che più adoro del mio lavoro è che mi permette di
            conoscere gente con cui condivido i miei stessi interessi. Ma il
            tour finisce e spesso ci si perde di vista, ed è un peccato! Quindi
            se ti va di rimanere in contatto con me o vuoi conoscermi, mi trovi
            tutti i giorni su Instagram, Facebook e Tik Tok. Qui pubblico
            curiosità e aneddoti proprio sui posti che hai visitato o che hai
            intenzione di conoscere qui in Toscana. Ti aspetto qui allora!
          </p>
          <Cta>
            Follow me <Icon icon="ant-design:instagram-filled" color="white" />
          </Cta>
        </div>
      </div>
    </div>
  );
};

export default Insta;
