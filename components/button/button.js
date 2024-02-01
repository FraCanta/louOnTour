import React from "react";
import { Icon } from "@iconify/react";

function Cta({ children }) {
  return (
    <div className="text-center capitalize font-bold py-2.5 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-[32px] text-main hover:transition-all  bg-white w-full">
      {children} <Icon icon="bi:arrow-right" />
    </div>
  );
}

export default Cta;
