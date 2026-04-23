import Link from "next/link";
import React from "react";

const CtaOutline = ({ children, link, className = "", title, target }) => {
  return (
    <Link
      href={link}
      title={title}
      target={target}
      className={`w-full lg:max-w-max text-center text-[#77674E] font-medium tracking-wide leading-snug py-3 px-6 2xl:px-6 xs:text-lg 3xl:text-3xl rounded-md border-2 border-[#77674E] ${className}`}
    >
      {children}
    </Link>
  );
};

export default CtaOutline;
