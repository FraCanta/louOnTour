import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/assets/logo_mobile2.png";
import { useRouter } from "next/router";

const Footer = ({ translation }) => {
  const { locale } = useRouter();
  return (
    <footer>
      <div className="bg-white text-[#232f37] ">
        <div className="container mx-auto p-8 ">
          <div className="grid grid-row-2">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-12 pb-16 px-4">
              <div className="grid grid-rows-2 grid-flow-col">
                <div className="flex items-center">
                  <Link href="/" passHref>
                    <Image
                      src={FooterLogo}
                      alt="LouLogo"
                      className="mr-4 w-[100px] h-[100px]"
                    />
                  </Link>
                </div>
                <div className="flex items-center">
                  <span className="text-indigo ml-1 text-sm w-4/5">
                    {" "}
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Doloremque ea ad facilis possimus consectetur neque quia
                    esse quasi commodi omnis quod quis eum cupiditate, maxime
                    eius rem officiis voluptate a?
                  </span>
                </div>
              </div>
              <div className="grid grid-rows-3 grid-flow-col gap-4 pt-2 lg:pt-6">
                <div className="font-semibold">Lou On Tour</div>
                <Link href="/about" className="font-normal">
                  Chi Sono
                </Link>
                <Link href="/about" className="font-normal">
                  Services
                </Link>
              </div>

              <div className="grid grid-rows-4 grid-flow-col gap-4 pt-6">
                <div className="font-semibold">Tours</div>
                <Link href="/tours" className="font-normal">
                  Tour da non perdere!
                </Link>
                <Link href="/how" className="font-normal">
                  Walking Tour
                </Link>
                <Link href="/how" className="font-normal">
                  Food Tour
                </Link>
              </div>

              <div className="grid grid-rows-4 grid-flow-col gap-4 pt-6">
                <div className="font-semibold">Social & Co.</div>
                <Link href="/contatti" className="font-normal">
                  Contact
                </Link>
                <Link href="/how" className="font-normal">
                  Instagram
                </Link>
                <Link href="/how" className="font-normal">
                  Tik Tok
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <div className="py-2 text-[#232f37] flex justify-center items-center text-sm font-extralight">
        <Icon icon="bi:c-circle" color="#232f37" width="12" height="12" />
        <p className="ml-1">Copyright Ubiquity 2022</p>
      </div>
    </footer>
  );
};

export default Footer;
