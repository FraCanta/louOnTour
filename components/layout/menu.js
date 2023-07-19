import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lou from "../../public/assets/logo4_small_2.webp";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Button from "../button/button";

const Menu = ({ translation }) => {
  const { locale } = useRouter();

  return (
    <div className="hidden xl:flex justify-center items-center w-full bg-white border-b border-black-500 z-20 menu_container h-[70px]">
      <div className="container mx-auto w-11/12 2xl:w-4/5">
        <div className="flex  mx-auto justify-between items-center px-0 ">
          <div className="flex items-center justify-center">
            <Link href="/">
              <Image src={Lou} alt="Lou Logo" className="w-[250px]" />
            </Link>
          </div>
          <nav className="menu-nav text-[#2C395B]">
            <ul className="links">
              <li>
                <Link href="/" className="2xl:text-base fxl:text-[18px]">
                  {translation?.[locale]?.home}
                </Link>
              </li>

              <li className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="font-normal 2xl:text-base fxl:text-[18px] flex items-center uppercase !mr-[40px] !ml-[40px] text-[#2C395B]"
                >
                  {translation?.[locale]?.tours}

                  <Icon
                    icon="bxs:down-arrow"
                    color="#2C395B"
                    width="10"
                    className="ml-2"
                  />
                </label>

                <>
                  <ul
                    tabIndex={0}
                    className="dropdown-content  shadow p-2 bg-white rounded-box w-48 !top-[2rem]"
                  >
                    {translation?.[locale]?.map?.markers.map((el, i) => (
                      <li key={i} className="py-1.5">
                        <Link
                          className="hover:underline text-sm !ml-2 text-[#2C395B]"
                          href={`/locations/${el?.link}`}
                        >
                          {el?.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
              <li>
                <Link
                  href="/chiSono"
                  className="2xl:text-base fxl:text-[18px] text-[#2C395B]"
                >
                  {translation?.[locale]?.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="2xl:text-l[12px] fxl:text-[18px] text-[#2C395B]"
                >
                  {translation?.[locale]?.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/contatti"
                  className="2xl:text-l[12px] fxl:text-[18px] text-[#2C395B]"
                >
                  {translation?.[locale]?.contact}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center ">
            {/* <div className="mr-6">
              <Link
                href="/newsletter"
                className="flex items-center justify-center px-[20px] h-[40px] leading-[20px] min-w-[40px] rounded-sm relative text-white  font-[600] shadow-md border border-2  bg-[#FE6847] border-[#FE6847] ring-2 ring-[#FE6847] hover:scale-110 uppercase font-extrabold grain text-[14px]"
              >
                <Icon
                  icon="heroicons:plus-20-solid"
                  width="20"
                  className="mr-2"
                />{" "}
                Iscriviti
              </Link>
            </div> */}

            {/* <Link
              href="https://www.facebook.com/luisa.quaglia.tourguide"
              className="mr-4"
              target="_blank"
            >
              <Icon icon="entypo-social:facebook" color="#FE6847" width="25" />
            </Link>
            <Link
              href="https://www.instagram.com/luisatourguide__/"
              className="mr-4"
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
              className=""
              target="_blank"
            >
              <Icon icon="simple-icons:tiktok" color="#FE6847" width="25" />{" "}
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
