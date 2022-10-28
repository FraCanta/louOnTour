import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Lou from "../../public/assets/lou.webp";
import gsap from "gsap";
import { Power1, Power2 } from "gsap";
import { Icon } from "@iconify/react";

function Menu_mobile() {
  const [mobileMenu, setMobileMenu] = useState({
    isOpen: false,
    fastClose: false,
  });

  const handleBurgerClick = () => {
    setMobileMenu((prevData) => {
      return { ...prevData, isOpen: !prevData.isOpen };
    });
  };
  const handleBurgerClose = () => {
    setMobileMenu({ isOpen: false, fastClose: true });
  };

  useEffect(() => {
    var tl = gsap.timeline({ defaults: { ease: Power1.easeOut } });
    if (mobileMenu.isOpen) {
      {
        /*  quando è aperto */
      }

      tl.set(".menu_mobile_content", {
        width: 0,
        opacity: 0,
      });
      tl.set([".bar-1", "bar-3"], {
        width: "20px",
        rotation: 0,
        y: 0,
      });
      tl.to(".menu-hamburger", {
        duration: 0.2,
        rotation: 90,
      });
      tl.to(".bar-2", {
        width: "5px",
        duration: 0.04,
      });

      tl.to(".menu_mobile_content", {
        duration: 0.5,
        width: "100vw",
        opacity: 1,
        ease: Power1.inOut,
      });
      tl.to(".bar-1", {
        duration: 0.2,
        y: 8,
        rotation: 45,
        ease: Power2.easeInOut,
      });

      tl.to(".bar-3", {
        duration: 0.08,
        rotation: -45,
        y: -10,
        ease: Power2.easeInOut,
      });
      tl.to(".bar-2", {
        duration: 0.2,
        autoAlpha: 0,
        x: "100vh",
        width: "55px",
        ease: Power2.easeInOut,
      });
      tl.to(".menu_mobile_item li a", {
        duration: 0.08,
        opacity: 1,
        stagger: {
          each: 0.5,
        },
      });
    } else if (!mobileMenu.isOpen) {
      {
        /* quando è chiuso */
      }
      {
        mobileMenu.fastClose &&
          tl.to(".menu_mobile_content", {
            duration: 0.6,
            width: "0%",
            opacity: 0,
            ease: Power1.inOut,
          });
      }
      tl.to(".bar-1", {
        duration: 0.2,
        y: 0,
        rotation: 0,
        ease: Power2.easeInOut,
      });
      tl.to(".bar-3", {
        duration: 0.2,
        rotation: 0,
        y: 0,
        ease: Power2.easeInOut,
      });
      tl.to(".bar-2", {
        duration: 0.5,
        autoAlpha: 1,
        ease: Power2.easeInOut,
        rotation: 0,
        x: 0,
        width: "30px",
      });
      tl.to(".menu-hamburger", {
        duration: 0.2,
        rotation: 0,
      });
      tl.to(".menu_mobile_content", {
        duration: 0.6,
        width: "0%",
        opacity: 0,
        ease: Power1.inOut,
      });
      tl.to(".menu_mobile_item li a", {
        duration: 0.3,
        opacity: 0,
        stagger: 0.1,
      });

      {
        mobileMenu.fastClose &&
          setMobileMenu({ isOpen: false, fastClose: false });
      }
    }
  }, [mobileMenu]); // eslint-disable-next-line no-console

  return (
    <div className="block xl:hidden sticky top-0 right-0 z-10  flex">
      <div className="header_mobile  flex justify-between h-[70px] items-center w-full  px-8 md:px-12 py-4">
        <div>
          <Link href="/">
            <Image src={Lou} alt="Lou Logo" width={50} height={50} />
          </Link>
        </div>

        <div className="menu-hamburger" onClick={handleBurgerClick}>
          <div className="menu-hamburger-line bar-1"></div>
          <div className="menu-hamburger-line bar-2"></div>
          <div className="menu-hamburger-line bar-3"></div>
        </div>
      </div>
      <div className="menu_mobile_content ">
        <div className="menu_mobile_body">
          <div className="menu-nav menu_mobile_item">
            <ul onClick={handleBurgerClose} className="w-4/5  ">
              <li>
                <Link
                  href="/"
                  className="text-[#0d0d0d] text-[40px] md:text-[60px] lg:text-[50px]"
                >
                  Inizi da qui!
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#0d0d0d] text-[40px] md:text-[60px] lg:text-[50px]"
                >
                  Tours
                  <Icon
                    icon="bxs:down-arrow"
                    color="#0d0d0d"
                    width="12"
                    className="ml-2"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/how"
                  className="text-[#0d0d0d] text-[40px] md:text-[60px] lg:text-[50px]"
                >
                  Chi sono
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#0d0d0d] text-[40px] md:text-[60px] lg:text-[50px]"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu_mobile;
