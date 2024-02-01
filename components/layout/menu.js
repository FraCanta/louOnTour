import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../public/assets/logo4_small_2.webp";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Mobile from "./mobile";

const Menu = ({ translation }) => {
  const { locale, pathname } = useRouter();

  return (
    <header className="relative">
      <nav className="h-[60px] md:h-[100px] lg:h-[70px] xl:h-[100px] 3xl:h-[180px] 4xl:h-[250px] 3xl flex w-full items-center justify-between relative z-[999999] nav-scroll ">
        <div className="flex w-[90%] mx-auto justify-between items-center ">
          <div className="flex-1">
            <Link href={`/`} title="Home Page">
              <Image
                src={Logo}
                alt="logo"
                className="w-[120px] md:w-[100px] xl:w-[130px] 2xl:w-[180px] fxl:w-[150px] 3xl:w-[200px] 4xl:w-[300px]"
              />
            </Link>
          </div>

          <div className="lg:flex items-center  hidden capitalize flex-1 text-[#4A4A49]">
            <div className="w-full flex items-center justify-end">
              <Link
                href={`/`}
                title="Scopri chi sono e cosa posso fare per te"
                className={`mr-[2.35rem] 3xl:mr-12 4xl:mr-16 text-[16px] md:text-[1.2rem] xl:text-[1.2rem] fxl:text-[25px]  3xl:text-[35px] 4xl:text-[55px]  text-[#2C395B] capitalize flex items-center ${
                  pathname === "/" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.home}
              </Link>

              <Link
                href={`/tours`}
                title="Ecco tutti i miei servizi"
                className={`mr-[2.35rem] 3xl:mr-12 4xl:mr-16 text-[16px] md:text-[1.2rem] xl:text-[1.2rem] fxl:text-[25px]  3xl:text-[35px] 4xl:text-[55px]  text-main  capitalize flex items-center ${
                  pathname === "/tours" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.tours}
              </Link>

              <Link
                href={`/chiSono`}
                title="Guarda tutti i miei casi studio"
                className={`mr-[2.35rem] 3xl:mr-12 4xl:mr-16 text-[16px] md:text-[1.2rem] xl:text-[1.2rem] fxl:text-[25px]  3xl:text-[35px] 4xl:text-[55px]  text-main  capitalize flex items-center ${
                  pathname === "/chiSono" ? "font-bold" : " "
                }`}
              >
                {translation?.[locale]?.about}
              </Link>
              <Link
                href={`/blog`}
                title="I miei articoli"
                className={`mr-[2.35rem] 3xl:mr-12 4xl:mr-16 text-[16px] md:text-[1.2rem] xl:text-[1.2rem] fxl:text-[25px]  3xl:text-[35px] 4xl:text-[55px]  text-main font-regular capitalize flex items-center ${
                  pathname === "/blog" ? "font-bold" : " "
                }`}
              >
                {translation?.[locale]?.blog}
              </Link>
              <Link
                href={`/contatti`}
                title="I miei articoli"
                className="mr-[2.35rem] 3xl:mr-12 4xl:mr-16 text-[16px] md:text-[1.2rem] xl:text-[1.2rem] fxl:text-[25px]  3xl:text-[35px] 4xl:text-[55px]  text-main font-regular capitalize flex items-center"
              >
                {translation?.[locale]?.contact}
              </Link>
              <Link
                href={`/newsletter`}
                title="I miei articoli"
                className="capitalize font-bold py-2.5 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 xl:text-[1rem] 2xl:text-[1.2rem]  fxl:text-2xl 3xl:text-3xl rounded-md shadow  text-white hover:transition-all  bg-[#fe6847]"
              >
                {translation?.[locale]?.iscriviti}
              </Link>
            </div>
          </div>

          <div className="text-main flex items-center justify-end py-1 lg:hidden ">
            <Mobile translation={translation} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Menu;
