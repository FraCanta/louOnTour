import React from "react";
import { Icon } from "@iconify/react";

function Cta({ children }) {
  return (
    <button className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-white  font-[600] shadow-3xl border  bg-[#FE6847] border-[#FE6847]  hover:scale-110 uppercase">
      {children} <Icon icon="bi:arrow-right" />
    </button>
  );
}

export default Cta;
// className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-[#FE6847]  font-[600] shadow-3xl border  bg-[#FE6847] border-[#FE6847]  hover:transition-all hover:bg-white hover:border-white uppercase
