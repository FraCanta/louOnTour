import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lou from "../../public/assets/logo4.png";
import { Icon } from "@iconify/react";
import translation from "../../public/locales/it/it.json";
// import { useRouter } from "next/router";

const Menu = ({ exact, href }) => {
  // const { pathname } = useRouter();

  // const isActive = exact ? pathname === href : pathname.startsWith(href);

  // if (isActive) {
  //   props.className !== undefined
  //     ? (props.className += " active")
  //     : (props.className = "active");
  // }
  return (
    <div className="hidden xl:flex justify-center items-center w-full bg-white border-b border-black-500 z-20 menu_container">
      <div className="container mx-auto w-4/5">
        <div className="flex  mx-auto justify-between items-center px-0 ">
          <div className="flex items-center justify-center">
            <Link href="/">
              <Image src={Lou} alt="Lou Logo" className="w-[250px]" />
            </Link>
          </div>
          <nav className="menu-nav text-[#232F37]">
            <ul className="links">
              <li>
                <Link href="/" className="2xl:text-base fxl:text-[18px]">
                  Inizi da qui!
                </Link>
              </li>

              <li className="dropdown dropdown-hover">
                <label
                  tabIndex={0}
                  className="font-normal 2xl:text-base fxl:text-[18px] flex items-center uppercase !mr-[40px] !ml-[40px]"
                >
                  Tours
                  <Icon
                    icon="bxs:down-arrow"
                    color="#232F37"
                    width="10"
                    className="ml-2"
                  />
                </label>

                <>
                  <ul
                    tabIndex={0}
                    className="dropdown-content  shadow p-2 bg-white rounded-box w-48 !top-[2rem]"
                  >
                    {translation?.home?.map?.markers?.map((el, i) => (
                      <li key={i} className="py-1.5">
                        <Link
                          className="hover:underline text-sm !ml-2"
                          href="/tours"
                        >
                          {el?.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
              {/* </li> */}
              <li>
                <Link href="/chiSono" className="2xl:text-base fxl:text-[18px]">
                  Chi sono
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="2xl:text-l[12px] fxl:text-[18px]"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex">
            <Link href="/contact" className="mr-4">
              <Icon icon="entypo-social:facebook" color="#E3494D" width="25" />
            </Link>
            <Link href="/contact" className="mr-4">
              <Icon
                icon="akar-icons:instagram-fill"
                color="#E3494D"
                width="25"
              />
            </Link>
            <Link href="/contact" className="">
              <Icon icon="entypo-social:youtube" color="#E3494D" width="25" />{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
