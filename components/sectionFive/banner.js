import Link from "next/link";
import React from "react";
import Cta from "../button/button";
import { Icon } from "@iconify/react";

const Banner = ({ translation }) => {
  return (
    <section className="section4">
      <div className="section_container w-11/12 2xl:w-4/5">
        <h2>{translation?.text}</h2>
        <Link href="/contatti">
          <Cta> {translation?.button}</Cta>
        </Link>
      </div>
    </section>
  );
};

export default Banner;
