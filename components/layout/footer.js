import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/assets/logo_mobile2.png";
import { useRouter } from "next/router";

const Footer = ({ translation }) => {
  const { locale } = useRouter();
  return (
    <>
      <footer className="footer p-10 bg-white text-[#232f37] ">
        <div>
          <Link href="/" passHref>
            <Image
              src={FooterLogo}
              alt="LouLogo"
              className="mr-4 w-[100px] h-[100px]"
            />
          </Link>{" "}
          <p>
            Licensed Tour Guide in English
            <br />
            P.Iva: 02436070508
          </p>
        </div>
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
          {/* <a className="link link-hover">Advertisement</a> */}
        </div>
        <div>
          <h6 className="footer-title text-black">Tours</h6>
          {translation?.markers?.map((el, i) => (
            <Link
              href={`/locations/${el?.title}`}
              className="link link-hover"
              key={i}
            >
              {el?.title}
            </Link>
          ))}
        </div>
        <div>
          <h6 className="footer-title text-black">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </div>
        <div>
          <h6 className="footer-title text-black">Social</h6>
          <div className="grid grid-flow-col gap-4">
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
      <div className="w-full h-[1px] bg-gray-200"></div>
      <footer className="footer footer-center p-4 bg-white  text-[#232f37]">
        <div>
          <p>Copyright © 2022 - All right reserved by Ubiquity</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
