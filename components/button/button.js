import React from "react";
import { Icon } from "@iconify/react";

function Cta({ children }) {
  return (
    <div className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-white  font-[600] shadow-md border border-2  bg-[#FE6847] border-[#FE6847] ring-2 ring-[#FE6847] hover:scale-110 uppercase font-extrabold grain">
      {children} <Icon icon="bi:arrow-right" />
    </div>
  );
}

export default Cta;
