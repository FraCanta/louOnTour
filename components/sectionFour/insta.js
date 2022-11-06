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
    <div className="h-[100vh] container mx-auto w-full 2xl:p-8">
      <div className="grid gap-14 md:gap-32 xl:gap-18 grid-cols-1 2xl:grid-cols-2 justify-items-center content-center pt-8 ">
        <div className="pt-0 h-full whitespace-nowrap overflow-x-auto overflow-y-hidden">
          <div className="inline-block">
            <div className="columns-4 lg:columns-4 2xl:columns-2">
              <div className="relative mb-4 before:content-[''] before:rounded-md before:absolute before:inset-0 before:bg-black before:bg-opacity-20">
                <Image
                  src={Lou}
                  alt="lou"
                  // width={300}
                  // height={300}
                  className="w-[400px] h-[500px]  2xl:w-[600px] 2xl:h-[500px] l rounded-md mr-20px"
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
                  className="w-[400px] h-[500px] 2xl:w-[600px] 2xl:h-[300px] rounded-md"
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
                  className="w-[400px] h-[500px] 2xl:w-[600px] 2xl:h-[300px] 2xl:w-full  rounded-md"
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
                  className="w-[400px] h-[500px] 2xl:w-[600px] 2xl:h-[500px] 2xl:w-full  rounded-md"
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
        <div className=" 2xl:p-0 w-4/5">
          <h4 className="text-[#E3494D]">Social</h4>
          <h2 className="text-4xl md:text-[64px] font-medium md:leading-none lg:leading-none text-[#232F37]">
            Lou On Tour Instagram
          </h2>
          <p className="text-base sm:text-lg  mt-4 sm:mt-10 mb-8 text-[#515151] ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
