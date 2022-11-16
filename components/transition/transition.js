import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Expo } from "gsap/dist/gsap";
import { useRouter } from "next/router";
function Transition() {
  const router = useRouter();
  const { locale } = useRouter();
  const trans = useRef(null);

  useEffect(() => {
    var tl = gsap.timeline({ repeatDelay: 1 });
    tl.to(trans.current, {
      duration: 1,
      width: "100%",
      left: "0%",
      ease: Expo.easeInOut,
    });
    tl.to(trans.current, {
      duration: 0.8,
      width: "100%",
      left: "100%",
      ease: Expo.easeInOut,
      delay: 0.3,
    });
    tl.set(trans.current, { left: "-100%" });
  });
  return (
    <div>
      <div
        className="bg-[#FE6847] transition-effect flex items-center justify-center text-2xl xl:text-8xl text-white uppercase"
        ref={trans}
      >
        {router?.pathname === "/"
          ? "HOME"
          : router?.pathname.includes("location")
          ? router?.query?.title
          : locale === "it"
          ? router?.pathname
              .slice(1)
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, function (str) {
                return str.toUpperCase();
              })
          : "SHIT PLEASE STUDY ITALIAN"}
      </div>
    </div>
  );
}

export default Transition;
