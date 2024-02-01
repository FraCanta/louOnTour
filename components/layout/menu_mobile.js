import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Lou from "../../public/assets/logo4_small_2.webp";
import gsap from "gsap";
import { Power1, Power2 } from "gsap";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

function Menu_mobile({ translation }) {
  const { locale } = useRouter();

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
      tl.to(".link_menu", {
        duration: 0.08,
        opacity: 1,
        stagger: {
          each: 0.5,
        },
      });
      tl.to(".socials a", {
        duration: 0.3,
        opacity: 1,
        stagger: {
          each: 0.2,
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
      tl.to(".link_menu", {
        duration: 0.3,
        opacity: 0,
        stagger: 0.1,
      });
      tl.to(".socials a", {
        duration: 0.2,
        opacity: 0,
        stagger: 0.5,
      });

      {
        mobileMenu.fastClose &&
          setMobileMenu({ isOpen: false, fastClose: false });
      }
    }
  }, [mobileMenu]); // eslint-disable-next-line no-console

  return (
    <div className="block xl:hidden relative top-0 right-0 z-20  flex">
      <div className="header_mobile  flex justify-between  items-center w-full  px-4 md:px-8 py-4">
        <div>
          <Link href="/">
            <Image src={Lou} alt="Lou Logo" className="w-[150px]" />
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
            <ul className="w-11/12  ">
              <li onClick={handleBurgerClose}>
                <Link
                  href="/"
                  className="text-[#2C395B] text-[40px] md:text-[70px] lg:text-[40px] !pb-4 md:!pb-4 link_menu"
                >
                  {translation?.[locale]?.home}
                </Link>
              </li>
              <li className="dropdown dropdown-right">
                <label
                  tabIndex={0}
                  className="text-[#2C395B] text-[40px] md:text-[70px] lg:text-[40px] font-normal !pl-0  !pr-8 md:!pr-20 flex items-center  !pb-4 md:!pb-4 link_menu"
                >
                  {translation?.[locale]?.tours}
                  <Icon
                    icon="bxs:down-arrow"
                    color="#2C395B"
                    width="10"
                    className="ml-2"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content min-h-[300px] md:min-h-[380px] !p-4 shadow rounded-box w-52 md:w-60 text-[#2C395B] z-[9999]"
                >
                  {translation?.[locale]?.map?.markers.map((el, i) => (
                    <li key={i} className="py-1.5" onClick={handleBurgerClose}>
                      <Link
                        className="hover:underline text-xl md:text-xl "
                        href={`/locations/${el?.link}`}
                      >
                        {el?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li onClick={handleBurgerClose}>
                <Link
                  href="/chiSono"
                  className="text-[#2C395B] text-[40px] md:text-[70px] lg:text-[40px] !pb-4 md:!pb-4 link_menu capitalize"
                >
                  {translation?.[locale]?.about}
                </Link>
              </li>
              <li onClick={handleBurgerClose}>
                <Link
                  href="/blog"
                  className="text-[#2C395B] text-[40px] md:text-[70px] lg:text-[40px] !pb-4 md:!pb-4 link_menu capitalize"
                >
                  {translation?.[locale]?.blog}
                </Link>
              </li>
              <li onClick={handleBurgerClose} className="pb-6">
                <Link
                  href="/contatti"
                  className="text-[30px] md:text-[70px] lg:text-[40px] px-[30px] border border-[#FE6847] py-2 rounded-md border-2 max-w-max capitalize"
                >
                  {translation?.[locale]?.contact}
                </Link>
              </li>
              <li onClick={handleBurgerClose}>
                <div className="flex items-center ">
                  <Link
                    href="/newsletter"
                    className="text-[30px] md:text-[70px] lg:text-[40px] px-[30px] border border-[#FE6847] bg-[#FE6847] py-2 rounded-md border-2 max-w-max text-white capitalize"
                  >
                    <Icon
                      icon="heroicons:plus-20-solid"
                      width="20"
                      className="mr-2"
                    />{" "}
                    {translation?.[locale]?.iscriviti}
                  </Link>
                </div>
              </li>
            </ul>
            <div className="socials w-11/12">
              <Link
                href="https://www.facebook.com/luisa.quaglia.tourguide"
                className="link_menu"
                target="_blank"
              >
                <Icon
                  icon="entypo-social:facebook"
                  color="#FE6847"
                  width="25"
                />
              </Link>

              <Link
                href="https://www.instagram.com/luisatourguide__/"
                className="link_menu"
                target="_blank"
              >
                <Icon
                  icon="akar-icons:instagram-fill"
                  color="#FE6847"
                  width="25"
                />
              </Link>

              <Link
                href="https://www.tiktok.com/@luisatourguide?is_from_webapp=1&sender_device=pc"
                className="link_menu"
                target="_blank"
              >
                <Icon icon="simple-icons:tiktok" color="#FE6847" width="25" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu_mobile;
