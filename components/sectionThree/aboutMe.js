import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Testimonials from "./testimonials";
import Testimonials2 from "./testimonials2";

const AboutMe = ({ translation }) => {
  return (
    <div className="about_me min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  py-8  w-full bg-[#232F37] mt-20 text-white flex items-center relative">
      <div className="grid gap-14 md:gap-14 xl:gap-28 grid-cols-1 xl:grid-cols-2 justify-items-center content-center w-11/12 xl:w-4/5 mx-auto h-full">
        <div>
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl text-bold">
            About me
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  md:leading-none lg:leading-none mb-10">
            Che dicono di me!
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 text-white">
            Il fatto che tu stia cercando un tour per conoscere meglio un luogo
            fa di te una persona curiosa e questo, a me, piace moltissimo! Ma
            dal tuo punto di vista però, è anche vero che è importante trovare
            la guida giusta, con cui poter entrare in sintonia e apprezzare
            meglio l’esperienza. Facciamo così: nell’attesa di conoscerci meglio
            durante il nostro tour, dai un’occhiata qui e leggi cosa dicono di
            me.
          </p>

          <Link href="/chiSono">
            <button className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-[#FE6847]  font-[600] shadow-3xl border border-[#FE6847] hover:transition-all hover:bg-white hover:border-white uppercase">
              scopri di più <Icon icon="bi:arrow-right" />
            </button>
          </Link>
        </div>
        <div>
          {/* <Testimonials translation={translation} /> */}
          <Testimonials2 translation={translation} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
