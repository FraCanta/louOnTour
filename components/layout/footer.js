import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/logo-2024.png";
import { useRouter } from "next/router";

const Footer = ({ translation }) => {
  const { locale } = useRouter();
  return (
    <>
      <footer className="footer p-4 xl:p-10  bg-white text-[#232f37]  border-t-[1px] border-b-[1px] border-t-principle/30 border-b-principle/30">
        <div>
          <Link href="/">
            <Image
              src={FooterLogo}
              alt="LouLogo"
              className="mr-4 w-[180px] object-cover mb-4"
            />
          </Link>
          <span className="italic text-principle/70 font-regular">
            {translation?.footer?.[locale]?.Col1?.title}
            <br />
            P.Iva: 02436070508
          </span>
        </div>

        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            {translation?.footer?.[locale]?.Col2?.title}
          </h6>
          <Link href="/chiSono" className="link link-hover text-[#898989]">
            {translation?.footer?.[locale]?.Col2?.row1}
          </Link>
          <Link href="/contatti" className="link link-hover text-[#898989]">
            {translation?.footer?.[locale]?.Col2?.row2}
          </Link>
          <Link
            href="/contatti"
            className="link link-hover text-white  bg-[#FE6847] p-[0.3rem]"
          >
            {translation?.footer?.[locale]?.Col2?.row3}
          </Link>
        </div>
        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            {translation?.footer?.[locale]?.Col3?.title}
          </h6>
          {translation?.menu?.[locale]?.map?.markers.map((el, i) => (
            <Link
              className="hover:underline text-sm text-[#898989]"
              href={`/locations/${el?.link}`}
              key={i}
            >
              {el?.title}
            </Link>
          ))}
        </div>
        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            {translation?.footer?.[locale]?.Col4?.title}
          </h6>
          <Link href="/blog" className="text-[#898989]">
            {" "}
            {translation?.footer?.[locale]?.Col4?.row1}
          </Link>
        </div>
        <div>
          <h6 className="footer-title text-[#2c395b] !opacity-100">
            {translation?.footer?.[locale]?.Col5?.title}
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
      <footer className="p-2 footer footer-center ">
        <div>
          <p className=" text-para text-sm   !opacity-100">
            Copyright © 2025 - All rights reserved by Luisa Quaglia Tour Guide -{" "}
            <Link
              href="/policy"
              target="_blank"
              className="font-bold underline"
            >
              Privacy Policy
            </Link>{" "}
            - Made with ❤️ by{" "}
            <Link
              href="https://www.thallion-dev.it/"
              target="_blank"
              className="font-bold underline"
            >
              thallion+dev - creative designer
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
