import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/assets/logo_mobile2.png";
import { useRouter } from "next/router";
import translation from "../../public/locales/it/it.json";

const Footer = () => {
  // console.log(translation);
  const { locale } = useRouter();
  return (
    <>
      <footer className="footer p-10 bg-white text-[#232f37]  text-base-content">
        <div>
          <h6 className="footer-title text-black">Lou On Tour</h6>
          <Link href="/chiSono" className="link link-hover">
            Chi Sono
          </Link>
          <Link href="/contatti" className="link link-hover">
            Contatti
          </Link>
          <Link
            href="/contatti"
            className="link link-hover text-white  bg-[#FE6847] p-[0.3rem]"
          >
            Collaborazioni
          </Link>
        </div>
        <div>
          <h6 className="footer-title text-black">Tours</h6>
          {translation?.home?.map?.markers
            ?.filter((el) => el?.desc)
            .map((el, i) => (
              <Link
                className="hover:underline text-sm"
                href={`/locations/${el?.title}`}
                key={i}
              >
                {el?.title}
              </Link>
            ))}
        </div>
        <div>
          <h6 className="footer-title text-black">Blog</h6>
          <Link href="/chiSono" className="link link-hover">
            News{" "}
          </Link>
          {/* <Link href="/contatti" className="link link-hover">
            Contatti
          </Link>
          <Link
            href="/contatti"
            className="link link-hover text-white  bg-[#FE6847] p-[0.3rem]"
          >
            Collaborazioni
          </Link> */}
        </div>
        <div></div>
        {/* <div>
          <h6 className="footer-title text-black">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </div> */}
      </footer>
      <footer className="footer px-10 py-4 border-t bg-white text-[#232f37]  text-base-content border-base-300">
        <div className="items-center grid-flow-col">
          <Image
            src={FooterLogo}
            alt="LouLogo"
            className="mr-4 w-[50px] h-[50px]"
          />
          <span>
            Licensed Tour Guide in English
            <br />
            P.Iva: 02436070508
          </span>
        </div>
        <div className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4 ">
            <Link href="/contact" className="mr-4">
              <Icon icon="entypo-social:facebook" color="#FE6847" width="25" />
            </Link>
            <Link href="/contact" className="mr-4">
              <Icon
                icon="akar-icons:instagram-fill"
                color="#FE6847"
                width="25"
              />
            </Link>
            <Link href="/contact" className="">
              <Icon icon="simple-icons:tiktok" color="#FE6847" width="25" />{" "}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
