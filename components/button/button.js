import React from "react";
import { Icon } from "@iconify/react";

function Cta({ children }) {
  return (
    <button className="border-2 px-6 py-3 md:px-8 md:py-[1.2rem] fxl:px-[3rem] 2xl:py-[1.5rem] fxl:py-[1rem] text-white 2xl:text-[1.2rem] fxl:text-[1.5rem] font-bold uppercase bg-[#E3494D] border-[#E3494D] rounded-2xl flex justify-between items-center min-w-[170px] md:min-w-[200px] 2xl:min-w-[220px] fxl:min-w-[280px] rotated:py-[1rem] rotated:px-[1.8rem] rotated:min-w-[170px]">
      {children} <Icon icon="bi:arrow-right" />
    </button>
  );
}

export default Cta;
