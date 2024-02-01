import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lou from "../../public/assets/logo4_small_2.webp";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

const Menu = ({ translation }) => {
  const { locale } = useRouter();

  return (
    <div className="hidden xl:flex justify-center items-center w-full bg-white border-b border-black-500 z-20 menu_container h-[50px]">
      <div className="container mx-auto w-11/12 2xl:w-[80%]">
        <div className="flex  justify-between items-center px-0 w-full">
          <div className="flex items-center justify-center">
            <Link href="/" title="Lou On Tour">
              <Image src={Lou} alt="Lou Logo" className="w-[180px]" />
            </Link>
          </div>
          <nav className="menu-nav capitalize">
            <ul className="links">
              <li>
                <Link href="/" className="2xl:text-[18px]">
                  {translation?.[locale]?.home}
                </Link>
              </li>

              <li className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="font-normal 2xl:text-[19px] flex items-center  !mr-[20px] !ml-[20px] "
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
                          className="hover:underline text-[18px] !ml-2 "
                          href={`/locations/${el?.link}`}
                        >
                          {el?.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
              {/* <li>
                <Link href="/tour" className="2xl:text-[18px] ">
                  Tour
                </Link>
              </li> */}
              <li>
                <Link href="/chiSono" className="2xl:text-[18px] ">
                  {translation?.[locale]?.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="2xl:text-[18px] ">
                  {translation?.[locale]?.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/contatti"
                  className="2xl:text-[18px] px-[30px] border border-[#FE6847] py-2 rounded-md border-2"
                >
                  {translation?.[locale]?.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="flex items-center justify-center px-[20px] h-[40px] leading-[20px] min-w-[40px] rounded-md relative text-white  font-[600] shadow-md border border-2  bg-[#FE6847] border-[#FE6847] ring-2 ring-[#FE6847] hover:scale-110  font-extrabold grain text-[14px]"
                >
                  <Icon
                    icon="heroicons:plus-20-solid"
                    width="20"
                    className="mr-2"
                  />{" "}
                  {translation?.[locale]?.iscriviti}
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
