import Image from "next/image";
import Link from "next/link";
import React from "react";

const Menu = () => {
  return (
    <div className="w-full bg-white border-b border-black-500 z-3 menu">
      <div className="container mx-auto w-4/5">
        <div className="flex  mx-auto justify-between items-center px-0 py-6">
          <div className="flex items-center justify-center  menu-logo">
            <Link href="/">
              {/* <Image
                src={UbiquityLogo}
                alt="Ubiquity Logo"
                width={40}
                height={40}
              /> */}
              Logo
            </Link>
          </div>
          <nav className="menu-nav ">
            <ul>
              <li>
                <Link href="/" className="lg:text-lg 3xl:text-3xl">
                  Inizi da qui!
                </Link>
              </li>
              <li>
                <Link href="/about" className="lg:text-lg 3xl:text-3xl">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/how" className="lg:text-lg 3xl:text-3xl">
                  Chi sono
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="lg:text-lg 3xl:text-3xl">
                  Contatti
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menu;
