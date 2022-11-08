import React from "react";
import Cta from "../button/button";

const Banner = () => {
  return (
    <section className="h-[25vh] bg-black">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[#121212]">Buho chi legge</h2>
        <Cta>Ciao</Cta>
      </div>
    </section>
  );
};

export default Banner;
