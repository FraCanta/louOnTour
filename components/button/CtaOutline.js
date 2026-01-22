import Link from "next/link";
import React from "react";

const CtaOutline = ({ children, link }) => {
  return (
    <Link
      href={link}
      className="w-full uppercase lg:w-max-content text-center text-[#2c395b] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-4 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] 3xl:text-3xl rounded-md border-2 border-[#2c395b]"
    >
      {children}
    </Link>
  );
};

export default CtaOutline;
