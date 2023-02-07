import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Whatsapp = () => {
  const [buttonState, setButtonState] = useState("hidden");
  const timer = useRef();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", showWhatsApp);
  }

  function showWhatsApp() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      setButtonState(
        "fixed z-10 inline-block p-3 bg-[#4BBFDC] text-[#6257ff] font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-[#E3494D] hover:text-white hover:shadow-lg focus:bg-[#6257ff] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#6257ff] active:shadow-lg transition duration-150 ease-in-out bottom-16 left-2"
      );
      clearTimeout(timer.current); //resetto il vecchio timeout se ho già scrollato
      timer.current = setTimeout(() => {
        setButtonState("hidden ");
      }, 4000);
    }
  }

  return (
    <>
      <Link href="https://wa.me/393200327355" target="_blank" rel="noReferrer">
        <div
          // type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className={buttonState}
        >
          <Icon
            icon="bi:chat-dots-fill"
            color="white"
            className="w-[18px] h-[18px] lg:w-[28px] lg:h-[28px]  bg-blue "
          />
        </div>
      </Link>
    </>
  );
};
export default Whatsapp;
