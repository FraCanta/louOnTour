import React from "react";
import Image from "next/image";
import Lou from "../../public/assets/foto1.jpg";
import Lou2 from "../../public/assets/foto2.jpg";
import Lou3 from "../../public/assets/foto3.jpg";
import Lou4 from "../../public/assets/foto4.jpg";

const Masonry = () => {
  return (
    <div className="hidden md:block pt-0 whitespace-nowrap overflow-x-auto overflow-y-hidden w-4/5 mx-auto lg:w-full">
      <div className="columns-2">
        <div className="w-[100%] h-[500px] first-pic relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20 masonry_img">
          <Image
            src={Lou}
            alt="lou"
            // objectFit="cover"

            // className="md:w-[400px] mdl:h-[400px]  rounded-md mr-20px"
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
        <div className="masonry_img w-[100%] h-[300px] second-pic relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
          <Image
            src={Lou2}
            alt="lou"
            // objectFit="cover"
            // width={300}
            // height={300}
            // className="md:w-[400px] md:h-[200px] rounded-md"
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
        <div className="masonry_img w-[100%] h-[300px] third-pic relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
          <Image
            src={Lou3}
            alt="lou"
            // objectFit="cover"
            // width={300}
            // height={300}
            // className="md:w-[400px] md:h-[200px] 2xl:w-full  rounded-md"
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
        <div className="masonry_img w-[100%] h-[500px] fourth-pic relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
          <Image
            src={Lou4}
            alt="lou"
            // objectFit="cover"
            // width={300}
            // height={300}
            // className="md:w-[400px] md:h-[400px] 2xl:w-full  rounded-md"
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
  );
};

export default Masonry;
