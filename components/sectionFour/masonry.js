import React from "react";
import Image from "next/image";
import Lou from "../../public/assets/fotoinsta2.jpg";
import Lou2 from "../../public/assets/fotoinsta4.jpg";
import Lou3 from "../../public/assets/foto2.jpg";
import Lou4 from "../../public/assets/fotoinsta.jpg";

const Masonry = () => {
  return (
    <div className="hidden md:block pt-0 whitespace-nowrap overflow-x-auto overflow-y-hidden w-4/5 mx-auto lg:w-full">
      <div className="columns-2">
        <div className="w-[100%] h-[500px] first-pic relative mb-4  masonry_img ">
          <Image src={Lou} alt="lou" width={500} height={625} quality={70} />
        </div>
        <div className="masonry_img w-[100%] h-[450px] second-pic relative mb-4 ">
          <Image src={Lou2} alt="lou" width={500} height={625} quality={70} />
        </div>
        <div className="masonry_img w-[100%] h-[450px] third-pic relative mb-4 ">
          <Image src={Lou3} alt="lou" width={500} height={625} quality={70} />
        </div>
        <div className="masonry_img w-[100%] h-[500px] fourth-pic relative mb-4 ">
          <Image src={Lou4} alt="lou" width={500} height={625} quality={70} />
        </div>
      </div>
    </div>
  );
};

export default Masonry;
