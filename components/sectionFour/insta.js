import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Lou from "../../public/assets/foto1.jpg";
import Lou2 from "../../public/assets/foto2.jpg";
import Lou3 from "../../public/assets/foto3.jpg";
import Lou4 from "../../public/assets/foto4.jpg";

const Insta = () => {
  return (
    <div className="min-h-[100vh] container mx-auto w-full 2xl:p-8">
      <div className="grid gap-14 md:gap-32 xl:gap-18 grid-cols-1 2xl:grid-cols-2 justify-items-center content-center pt-8 ">
        <div className="pt-0 h-full whitespace-nowrap overflow-x-auto overflow-y-hidden w-full">
          <div className="inline-block">
            <div className=" hidden md:columns-2 md:block">
              <div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
                <Image
                  src={Lou}
                  alt="lou"
                  // width={300}
                  // height={300}
                  className="md:w-[400px] mdl:h-[400px]  rounded-md mr-20px"
                />
                <div className="test__body absolute inset-0 p-8 text-white flex flex-col">
                  <div className="relative">
                    <a
                      className="test__link absolute inset-0"
                      target="_blank"
                      href="/"
                    ></a>
                    <h1 className="test__title text-3xl font-bold mb-3">
                      Title post
                    </h1>
                    <p className="test__author font-sm font-light">Author</p>
                  </div>
                  <div className="mt-auto">
                    <span className="test__tag bg-white bg-opacity-60 py-1 px-4 rounded-md text-black">
                      #tag
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
                <Image
                  src={Lou2}
                  alt="lou"
                  // width={300}
                  // height={300}
                  className="md:w-[400px] md:h-[200px] rounded-md"
                />

                <div className="test__body absolute inset-0 p-8 text-white flex flex-col">
                  <div className="relative">
                    <a
                      className="test__link absolute inset-0"
                      target="_blank"
                      href="/"
                    ></a>
                    <h1 className="test__title text-3xl font-bold mb-3">
                      Title post
                    </h1>
                    <p className="test__author font-sm font-light">Author</p>
                  </div>
                  <div className="mt-auto">
                    <span className="test__tag bg-white bg-opacity-60 py-1 px-4 rounded-md text-black">
                      #tag
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
                <Image
                  src={Lou3}
                  alt="lou"
                  // width={300}
                  // height={300}
                  className="md:w-[400px] md:h-[200px] 2xl:w-full  rounded-md"
                />
                <div className="test__body absolute inset-0 p-8 text-white flex flex-col">
                  <div className="relative">
                    <a
                      className="test__link absolute inset-0"
                      target="_blank"
                      href="/"
                    ></a>
                    <h1 className="test__title text-3xl font-bold mb-3">
                      Title post
                    </h1>
                    <p className="test__author font-sm font-light">Author</p>
                  </div>
                  <div className="mt-auto">
                    <span className="test__tag bg-white bg-opacity-60 py-1 px-4 rounded-md text-black">
                      #tag
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
                <Image
                  src={Lou4}
                  alt="lou"
                  // width={300}
                  // height={300}
                  className="md:w-[400px] md:h-[400px] 2xl:w-full  rounded-md"
                />
                <div className="test__body absolute inset-0 p-8 text-white flex flex-col">
                  <div className="relative">
                    <a
                      className="test__link absolute inset-0"
                      target="_blank"
                      href="/"
                    ></a>
                    <h1 className="test__title text-3xl font-bold mb-3">
                      Title post
                    </h1>
                    <p className="test__author font-sm font-light">Author</p>
                  </div>
                  <div className="mt-auto">
                    <span className="test__tag bg-white bg-opacity-60 py-1 px-4 rounded-md text-black">
                      #tag
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        {/* <div className="masonry-container flex justify-start w-full overflow-x-hidden">
          <div className="masonry-wrapper flex w-full 2xl:4/5 justify-between overflow-x-auto ">
            <div className="first-col flex flex-row 2xl:flex-col h-full w-[48%]  justify-between">
§              <Image src={Lou} className="w-[200px] h-[200px]  rounded-md" />
              <Image src={Lou2} className="w-[200px] h-[200px]  rounded-md" />
            </div>
            <div className="second-col flex flex-row 2xl:flex-col h-full w-[48%] justify-between">
              <Image src={Lou3} className="w-[200px] h-[200px]  rounded-md" />
              <Image src={Lou4} className="w-[200px] h-[200px]  rounded-md" />
            </div>
          </div>
        </div> */}
        <div className=" 2xl:p-0 w-4/5">
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
