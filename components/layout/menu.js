import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lou from "../../public/assets/lou.webp";
import { Icon } from "@iconify/react";

const Menu = () => {
  return (
    <div className="hidden xl:flex w-full bg-white border-b border-black-500 z-3 menu">
      <div className="container mx-auto w-4/5">
        <div className="flex  mx-auto justify-between items-center px-0 py-6">
          <div className="flex items-center justify-center  menu-logo">
            <Link href="/">
              <Link href="/">
                <Image src={Lou} alt="Lou Logo" width={80} height={80} />
              </Link>
            </Link>
          </div>
          <nav className="menu-nav ">
            <ul>
              <li>
                <Link href="/" className="2xl:text-l[12px] fxl:text-[18px]">
                  Inizi da qui!
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="2xl:text-l[12px] fxl:text-[18px]"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/how" className="2xl:text-l[12px] fxl:text-[18px]">
                  Chi sono
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="2xl:text-l[12px] fxl:text-[18px]"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </nav>
          <div className="socials">
            <button className="btn lg:text-lg 3xl:text-2xl mr-4">
              <Link href="/contact" className="">
                <Icon
                  icon="entypo-social:facebook"
                  color="#e3494d"
                  width="25"
                />
              </Link>
            </button>
            <button className="btn lg:text-lg 3xl:text-2xl mr-4">
              <Link href="/contact" className="">
                <Icon
                  icon="akar-icons:instagram-fill"
                  color="#e3494d"
                  width="25"
                />
              </Link>
            </button>
            <button className="btn lg:text-lg 3xl:text-2xl">
              <Link href="/contact" className="">
                <Icon icon="entypo-social:youtube" color="#e3494d" width="25" />{" "}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
