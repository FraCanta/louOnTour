import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

function CtaPrimary({ children, link }) {
  return (
    <Link
      href={link}
      className="flex items-center justify-center gap-1 text-center lg:max-w-max  font-medium py-3 px-6 3xl:py-6 3xl:px-8 xs:text-lg tracking-wide  3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#77674E] w-full text-white"
    >
      {children}
    </Link>
  );
}

export default CtaPrimary;
