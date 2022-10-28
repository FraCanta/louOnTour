import Link from "next/link";
import React from "react";

function Menu_mobile() {
  return (
    <div className="block xl:hidden sticky top-0 right-0 z-10  flex">
      <div className="flex justify-between h-[50px] w-full  px-8 md:px-12 py-4">
        <div>
          <Link href="/">
            {/* <Image
                src={MobileLogo}
                alt="Ubiquity Logo"
                width={50}
                height={50}
              /> */}
            Logo
          </Link>
        </div>

        <div className="menu-hamburger">
          <div className="menu-hamburger-line bar-1"></div>
          <div className="menu-hamburger-line bar-2"></div>
          <div className="menu-hamburger-line bar-3"></div>
        </div>
      </div>
      {/* <div className="menu_mobile_content dark:bg-black">
        <div className="menu_mobile_body">
          <div className="menu-nav menu_mobile_item">
            <ul className="w-4/5  ">
              <li>
                <Link href="/" className="dark:text-white">
                    Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="dark:text-white">
                  {translation?.[locale]?.about}
                </Link>
              </li>
              <li>
                <Link href="/how" className="dark:text-white">
                  {translation?.[locale]?.how}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="dark:text-white">
                  {translation?.[locale]?.pricing}
                </Link>
              </li>
            </ul>
          </div>
          <div className="btn_mobile_contact w-4/5">
            <button className="btn">
              <Link href="/contact">{translation?.[locale]?.contact}</Link>
            </button>
            <div className="btn_shadow"></div>
          </div>
          <div className="social_mobile w-4/5">
            <a
              href="https://www.facebook.com/ubiquitywebcreativelab"
              target="_blank"
              rel="noReferrer"
              className="dark:text-white"
            >
              Fb
            </a>
            <a
              href="https://www.linkedin.com/company/ubiquity-web-creative-lab/"
              target="_blank"
              rel="noReferrer"
              className="dark:text-white"
            >
              Ln
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Menu_mobile;
