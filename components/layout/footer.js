import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FooterLogo from "../../public/logo_lou2.png";
import { useRouter } from "next/router";
import Subscribe from "../newsletter/subscribe";

const Footer = ({ translation }) => {
  const { locale } = useRouter();
  return (
    <>
      <footer className=" flex flex-col justify-center px-4 py-10 2xl:p-10 min-h-[40vh] lg:min-h-[50vh]  text-[#232f37] ">
        <div className="grid w-11/12 grid-cols-1 mx-auto gap-y-4 lg:grid-cols-2">
          <div className="flex flex-col w-full gap-10">
            <div>
              <Link href="/">
                <Image
                  src={FooterLogo}
                  alt="LouLogo"
                  className="mr-4 w-[180px] lg:w-[200px] 2xl:w-[280px] object-cover mb-4"
                />
              </Link>
            </div>
            <p className="max-w-lg xl:text-xl text-para">
              Iscriviti alla newsletter per partecipare ai tour esclusivi
              dedicati alla mia community più affezionata!
            </p>
            <Subscribe translation={translation} variant="footer" />
          </div>
          <div className="grid justify-between h-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col gap-2">
              <h6 className="footer-title text-para !opacity-100">
                {translation?.footer?.[locale]?.Col3?.title}
              </h6>
              {translation?.menu?.[locale]?.map?.markers.map((el, i) => (
                <Link
                  className="text-base hover:underline text-para"
                  href={`/tour/${el?.link}`}
                  key={i}
                >
                  {el?.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="footer-title text-para !opacity-100">
                {translation?.footer?.[locale]?.Col4?.title}
              </h6>
              <Link href="/blog" className="text-para">
                {" "}
                {translation?.footer?.[locale]?.Col4?.row1}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="footer-title text-para !opacity-100">
                {translation?.footer?.[locale]?.Col5?.title}
              </h6>
              <div className="flex gap-2">
                <Link
                  href="https://www.facebook.com/luisa.quaglia.tourguide"
                  target="_blank"
                >
                  <Icon
                    icon="entypo-social:facebook"
                    color="#C9573C"
                    width="25"
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/luisa_guidaturisticatoscana/"
                  target="_blank"
                >
                  <Icon
                    icon="akar-icons:instagram-fill"
                    color="#C9573C"
                    width="25"
                  />
                </Link>
                <Link
                  href="https://www.tiktok.com/@luisa_guidatoscana"
                  target="_blank"
                >
                  <Icon icon="simple-icons:tiktok" color="#C9573C" width="25" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 !w-full">
              <h6 className="footer-title text-para !opacity-100 !w-full">
                {translation?.footer?.[locale]?.Col2?.title}
              </h6>
              <div>
                <Link
                  href="mailto:luisaquaglia.tourguide@gmail.com"
                  className="text-base text-para"
                >
                  luisaquaglia.tourguide@gmail.com
                </Link>
              </div>

              <Link
                href="https://wa.me/393200327355"
                target="_blank"
                title="Luisa Quaglia | Come prenotare e avere info sui tour da fare"
                className="self-start flex items-center gap-2 lg:w-max-max w-fit text-center text-[#c9573c] tracking-wide  font-medium  leading-snug py-3 px-6 xs:text-lg 3xl:text-3xl rounded-md border-2 border-[#c9573c]"
              >
                Contattami
                <Icon
                  icon="basil:whatsapp-outline"
                  width="24"
                  height="24"
                  className="flex-shrink-0"
                />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <footer className="grid justify-center w-full p-2 px-4 py-2 text-base 2xl:text-sm lg:grid-cols-3 gap-y-4 lg:text-center text-para">
        <div className="text-left">
          © {new Date().getFullYear()} Luisa Quaglia Tour Guide -
          <span className="font-regular">
            {translation?.footer?.[locale]?.Col1?.title} - P.Iva: 02436070508
          </span>
        </div>
        <div className="flex gap-2 lg:justify-center">
          <Link
            href="https://www.iubenda.com/privacy-policy/15052201"
            target="_blank"
            className="font-bold underline"
          >
            Privacy Policy
          </Link>{" "}
          <Link
            href="https://www.iubenda.com/privacy-policy/15052201/cookie-policy"
            target="_blank"
            className="font-bold underline"
          >
            Cookie Policy
          </Link>
        </div>
        <div className="lg:text-right">
          {" "}
          Made with ❤️ by{" "}
          <Link
            href="https://www.thallion-dev.it/"
            target="_blank"
            className="font-bold underline"
          >
            Thallion Dev
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
