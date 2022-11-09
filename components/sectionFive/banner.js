import Link from "next/link";
import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";

const Banner = () => {
  return (
    <section className="section4 ">
      <div className="section_container ">
        <h2 className="text-white">
          Organizziamo insieme il tour su misura per te!
        </h2>
        <Link href="/contact">
          <button className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-[#E3494D]  font-[600] shadow-3xl border border-[#E3494D] hover:transition-all hover:bg-white hover:border-white uppercase">
            Contattami <Icon icon="bi:arrow-right" />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Banner;
