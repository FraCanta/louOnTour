import Link from "next/link";
import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";

const Banner = ({ translation }) => {
  return (
    <section className="section4">
      <div className="section_container w-11/12 2xl:w-4/5">
        <h2>{translation?.text}</h2>
        <Link
          href="/contatti"
          className="flex items-center gap-2 max-w-max text-center capitalize font-bold py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md text-main hover:transition-all  bg-[#fe6847] w-full text-white"
        >
          {translation?.button}
        </Link>
      </div>
    </section>
  );
};

export default Banner;
