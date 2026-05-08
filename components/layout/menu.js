import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../../public/logo_lou2.png";
import { useRouter } from "next/router";
import Mobile from "./mobile";
import { Icon } from "@iconify/react/dist/iconify.js";
import CtaOutline from "../button/CtaOutline";
import CtaPrimary from "../button/CtaPrimary";
import BgAnimation from "../bgAnimation/bgAnimation";

const Menu = ({ translation }) => {
  const { locale, pathname } = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);
  return (
    <header className="relative">
      <nav className="h-[70px] lg:px-10 md:h-[100px] lg:h-[70px] xl:h-[100px] qhd:h-[133px] 3xl:h-[180px] 4xl:h-[250px] flex w-full items-center justify-between relative z-[999999] nav-scroll ">
        <div className="flex items-center justify-between w-11/12 mx-auto ">
          <div className="z-50 flex items-center gap-10">
            <Link href={`/`} title="Luisa Quaglia | Home Page">
              <Image
                src={Logo}
                alt="logo"
                className="w-[160px] md:w-[100px] xl:w-[150px] 2xl:w-[180px] qhd:w-[240px] 3xl:w-[200px] 4xl:w-[300px] object-cover"
              />
            </Link>
            <div className="items-center hidden text-xl qhd:text-[1.65rem] lg:flex text-[#c9573c]  ">
              <div className="relative flex items-center justify-end w-full gap-10 qhd:gap-14">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  aria-controls="tour-menu-panel"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                  className="flex items-end gap-1 text-xl qhd:text-[1.65rem] font-medium tracking-wider"
                >
                  {translation?.[locale]?.tours}

                  <Icon
                    icon="mdi:chevron-down"
                    width="25"
                    className={`transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id="tour-menu-panel"
                  onClick={(e) => e.stopPropagation()}
                  className={`
    absolute z-50 p-4 mt-6
    transition-all duration-300 origin-top
    rounded-sm shadow-xl w-max top-full -left-1/2
    bg-white/90 backdrop-blur-md

    ${
      open
        ? "opacity-100 visible scale-100 translate-y-0"
        : "opacity-0 invisible scale-90 translate-y-4"
    }
  `}
                >
                  {" "}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col h-full w-[500px] justify-evenly">
                      {translation?.[locale]?.map?.markers.map((el, i) => (
                        <Link
                          href={`/tour/${el?.link}`}
                          onClick={() => setOpen(false)}
                          className="p-4 text-principle text-3xl qhd:text-4xl transition rounded-sm font-regular hover:bg-[#CE9486]/20"
                          key={i}
                        >
                          {el?.title}
                          <p className="text-base text-para">
                            {el?.description}
                          </p>
                        </Link>
                      ))}
                      <Link
                        href={`/tours-da-fare`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1 p-4 text-2xl text-principle"
                      >
                        Tutti i tours{" "}
                        <Icon
                          icon="lets-icons:arrow-right-light"
                          width="24px"
                          height="24px"
                          style={{ color: "#77674E" }}
                        />
                      </Link>
                    </div>

                    <div className="hero2  min-h-[65vh] 2xl:min-h-[45vh] fxl:min-h-[55svh] w-full">
                      <BgAnimation />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/chi-sono`}
                  title="Luisa Quaglia | Chi sono"
                  className={` tracking-wider flex items-center text-xl qhd:text-[1.65rem] ${
                    pathname === "/chi-sono" ? "font-bold" : " "
                  }`}
                >
                  {translation?.[locale]?.about}
                </Link>
                <Link
                  href={`/blog`}
                  title="Luisa Quaglia | Blog"
                  className={`tracking-wider text-xl qhd:text-[1.65rem] flex items-center ${
                    pathname === "/blog" ? "font-bold" : " "
                  }`}
                >
                  {translation?.[locale]?.blog}
                </Link>
                <Link
                  href={`/eventi`}
                  title="Luisa Quaglia | Eventi"
                  className={`tracking-wider text-xl qhd:text-[1.65rem] flex items-center ${
                    pathname === "/eventi" ? "font-bold" : " "
                  }`}
                >
                  {translation?.[locale]?.events}
                </Link>
              </div>
            </div>
          </div>

          <div className="items-center hidden gap-4 text-xl qhd:gap-5 lg:flex ">
            <Link
              href="https://wa.me/393200327355"
              target="_blank"
              title="Luisa Quaglia | Come prenotare e avere info sui tour da fare"
              className="w-full flex items-center gap-2 lg:w-max-content text-center text-[#c9573c] tracking-wide font-medium leading-snug py-3 px-6 qhd:py-6 qhd:px-10 xs:text-lg qhd:text-[1.5rem] 3xl:text-3xl rounded-md border-2 border-[#c9573c]"
            >
              {translation?.[locale]?.contact}{" "}
              <Icon
                icon="basil:whatsapp-outline"
                width="24"
                height="24"
                className="flex-shrink-0"
              />
            </Link>
            <CtaPrimary
              link={`/newsletter`}
              title="I miei articoli"
              className="!w-auto whitespace-nowrap px-5 xl:px-6 qhd:px-8 qhd:py-4 text-base xl:text-lg qhd:text-[1.45rem]"
            >
              {translation?.[locale]?.iscriviti}
            </CtaPrimary>
          </div>
          <div className="flex items-center justify-end py-1 text-main lg:hidden ">
            <Mobile translation={translation} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Menu;
