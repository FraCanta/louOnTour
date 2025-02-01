import Link from "next/link";
import React from "react";

const CtaWhite = ({ children, link }) => {
  return (
    <Link
      href={link}
      className="flex justify-center gap-2 uppercase items-center lg:max-w-max  text-[#2c395b] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-4 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-xl 3xl:text-3xl rounded-md border-2 bg-white"
    >
      {children}
    </Link>
  );
};

export default CtaWhite;
