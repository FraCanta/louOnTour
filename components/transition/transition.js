import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Expo } from "gsap/dist/gsap";
function Transition() {
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
      <div className="bg-[#FE6847] transition-effect " ref={trans}></div>
      Page
    </div>
  );
}

export default Transition;
