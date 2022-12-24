import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/assets/logo_mobile2.png";
import { useRouter } from "next/router";
import translation from "../../public/locales/it/it.json";

const Footer = ({ post }) => {
  const { locale } = useRouter();
  return (
    <>
      <footer className="footer p-4 xl:p-10  bg-white text-[#232f37]  text-base-content border-t-2 border-b-2 border-b-[#2c395b]">
        <div>
          <Image
            src={FooterLogo}
            alt="LouLogo"
            className="mr-4 w-[100px] h-[100px]"
          />
          <span>
            Licensed Tour Guide in English
            <br />
            P.Iva: 02436070508
          </span>
        </div>
        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            Lou On Tour
          </h6>
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
          <h6 className="footer-title text-[#2c395b] !opacity-100">Tours</h6>
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
          <h6 className="footer-title text-[#2c395b] !opacity-100">Blog</h6>
          <Link href="/blog">
            {/* <p>{jsxPosts}</p> */}
            Ultime News
          </Link>
        </div>
        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            Seguimi su
          </h6>
          <div className="flex">
            <Link
              href="https://www.facebook.com/luisa.quaglia.tourguide"
              target="_blank"
              className="mr-4"
            >
              <Icon icon="entypo-social:facebook" color="#FE6847" width="25" />
            </Link>
            <Link
              href="https://www.instagram.com/luisatourguide__/"
              target="_blank"
              className="mr-4"
            >
              <Icon
                icon="akar-icons:instagram-fill"
                color="#FE6847"
                width="25"
              />
            </Link>
            <Link
              href="https://www.tiktok.com/@luisatourguide?is_from_webapp=1&sender_device=pc"
              target="_blank"
            >
              <Icon icon="simple-icons:tiktok" color="#FE6847" width="25" />
            </Link>
          </div>
        </div>
      </footer>
      <footer className="footer footer-center  p-2 !bg-[#2c395b]  grain text-base-content ">
        <div>
          <p className=" text-white  !opacity-100">
            Copyright © 2022 - All rights reserved by Lou On Tour
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
