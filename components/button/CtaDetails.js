import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

function CtaDetails({ children, link }) {
  return (
    <Link
      href={link}
      className="text-center uppercase lg:max-w-max  font-bold py-4 px-6 3xl:py-6 3xl:px-8 2xl:text-[0.9rem] fxl:text-2xl 3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#2c395b] w-full text-white"
    >
      {children}
    </Link>
  );
}

export default CtaDetails;
