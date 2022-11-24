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
          <address>
            Licensed Tour Guide in English
            <br />
            P.Iva: 02436070508
          </address>
        </div>
        <div>
          <h6 className="footer-title">Lou On Tour</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </div>
        <div>
          <h6 className="footer-title">Tours</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </div>
        <div>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </div>
        <div>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
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

    // <footer>
    //   <div className="bg-white text-[#232f37] ">
    //     <div className="container mx-auto p-8 ">
    //       <div className="grid grid-row-2">
    //         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-12 pb-16 px-4">
    //           <div className="grid grid-rows-2 grid-flow-col">
    //             <div className="flex items-center">

    //             </div>
    //             <div className="flex items-center">
    //               <span className="text-indigo ml-1 text-sm w-4/5">
    //                 {" "}
    //                 Lorem ipsum, dolor sit amet consectetur adipisicing elit.
    //                 Doloremque ea ad facilis possimus consectetur neque quia
    //                 esse quasi commodi omnis quod quis eum cupiditate, maxime
    //                 eius rem officiis voluptate a?
    //               </span>
    //             </div>
    //           </div>
    //           <div className="grid grid-rows-3 grid-flow-col gap-4 pt-2 lg:pt-6">
    //             <div className="font-semibold">Lou On Tour</div>
    //             <Link href="/about" className="font-normal">
    //               Chi Sono
    //             </Link>
    //             <Link href="/about" className="font-normal">
    //               Services
    //             </Link>
    //           </div>

    //           <div className="grid grid-rows-4 grid-flow-col gap-4 pt-6">
    //             <div className="font-semibold">Tours</div>
    //             <Link href="/tours" className="font-normal">
    //               Tour da non perdere!
    //             </Link>
    //             <Link href="/how" className="font-normal">
    //               Walking Tour
    //             </Link>
    //             <Link href="/how" className="font-normal">
    //               Food Tour
    //             </Link>
    //           </div>

    //           <div className="grid grid-rows-4 grid-flow-col gap-4 pt-6">
    //             <div className="font-semibold">Social & Co.</div>
    //             <Link href="/contatti" className="font-normal">
    //               Contact
    //             </Link>
    //             <Link href="/how" className="font-normal">
    //               Instagram
    //             </Link>
    //             <Link href="/how" className="font-normal">
    //               Tik Tok
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-full h-[1px] bg-gray-200"></div>
    //   <div className="py-2 text-[#232f37] flex justify-center items-center text-sm font-extralight">
    //     <Icon icon="bi:c-circle" color="#232f37" width="12" height="12" />
    //     <p className="ml-1">Copyright Ubiquity 2022</p>
    //   </div>
    // </footer>
  );
};

export default Footer;
