import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

function CtaPrimary({ children, link, className = "", title, target }) {
  return (
    <Link
      href={link}
      title={title}
      target={target}
      className={`flex items-center justify-center gap-1 text-center lg:max-w-max font-medium py-3 px-6 qhd:py-6 qhd:px-10 3xl:py-6 3xl:px-10 xs:text-lg qhd:text-[1.5rem] tracking-wide 3xl:text-3xl rounded-md text-main hover:transition-all bg-[#77674E] w-full text-white ${className}`}
    >
      {children}
    </Link>
  );
}

export default CtaPrimary;
