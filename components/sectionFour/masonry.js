"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import Lou from "../../public/assets/fotoinsta2.jpg";
import Lou2 from "../../public/assets/fotoinsta4.jpg";
import Lou3 from "../../public/assets/foto2.jpg";
import Lou4 from "../../public/assets/fotoinsta.jpg";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.45, // lento ma non eccessivo
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2, // animazione lenta
      ease: [0.22, 1, 0.36, 1], // smooth editoriale
    },
  },
};

const Masonry = () => {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden lg:w-11/12 whitespace-nowrap">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="columns-2"
      >
        <motion.div
          variants={item}
          className="w-[100%] h-[300px] xl:h-[350px] fxl:h-[450px] first-pic relative mb-4 masonry_img break-inside-avoid"
        >
          <Image src={Lou} alt="lou" width={400} height={625} quality={70} />
        </motion.div>

        <motion.div
          variants={item}
          className="masonry_img w-[100%] h-[160px] xl:h-[200px] fxl:h-[350px] second-pic relative mb-4 break-inside-avoid"
        >
          <Image src={Lou2} alt="lou" width={500} height={625} quality={70} />
        </motion.div>

        <motion.div
          variants={item}
          className="masonry_img w-[100%] h-[160px] xl:h-[200px] fxl:h-[350px] third-pic relative mb-4 break-inside-avoid"
        >
          <Image src={Lou3} alt="lou" width={500} height={625} quality={70} />
        </motion.div>

        <motion.div
          variants={item}
          className="masonry_img w-[100%] h-[300px] xl:h-[350px] fxl:h-[450px] fourth-pic relative mb-4 break-inside-avoid"
        >
          <Image src={Lou4} alt="lou" width={500} height={625} quality={70} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Masonry;
