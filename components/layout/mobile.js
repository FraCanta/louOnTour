import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
const Mobile = ({ translation }) => {
  const { locale, pathname } = useRouter();

  const [open, setOpen] = useState(false);
  const svgVariants = {
    closed: {
      path: "M4 6h16M4 12h16M4 18h16",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    open: {
      path: "M6 18L18 6M6 6l12 12",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };
  const variants = {
    open: { opacity: 1, height: "100vh", transition: { duration: 0.5 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5 } },
    item: { opacity: 0, y: 100, transition: { duration: 0.5 } },
    visibleItem: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className="flex items-center gap-8">
      <motion.div
        id="close"
        onClick={handleOpen}
        className="z-50 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#C9573C"
          className="w-6 h-6"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={open ? svgVariants.open.path : svgVariants.closed.path}
            variants={svgVariants}
          />
        </svg>
      </motion.div>

      {/* Conditionally render the menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className=" absolute top-0 left-0 right-0 bg-[#fef3ea] h-screen w-screen text-[#2c395b]   flex flex-col "
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Add your menu items here */}
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto mt-20"
            ></motion.div>
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto"
            >
              <Link
                href={`/tours-da-fare`}
                title="Ecco tutti i mieiTour"
                className={`menu-item block mb-6 text-[25px] leading-[30px] font-regular text-[#2c395b] uppercase ${
                  pathname === "/tours-da-fare" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.tours}
              </Link>
            </motion.div>
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto"
            >
              <Link
                href={`/chi-sono`}
                title="Guarda tutti i miei casi studio"
                className={`menu-item  block mb-6 text-[25px] leading-[30px] font-regular text-[#2c395b] uppercase ${
                  pathname === "/chi-sono" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.about}
              </Link>
            </motion.div>
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto"
            >
              <Link
                href={`/blog`}
                title="I miei articoli"
                className={`menu-item  block mb-6 text-[25px] leading-[30px] font-regular text-[#2c395b] uppercase ${
                  pathname === "/blog" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.blog}
              </Link>
            </motion.div>
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto"
            >
              <Link
                href={`/contatti`}
                title="I miei articoli"
                className={`menu-item  block mb-6 text-[25px] leading-[30px] font-regular text-[#2c395b] uppercase ${
                  pathname === "/contatti" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.contact}
              </Link>
            </motion.div>
            <motion.div
              variants={variants.item}
              animate="visibleItem"
              className="w-11/12 mx-auto"
            >
              <Link
                href={`/newsletter`}
                title="I miei articoli"
                className={`menu-item block mt-6 text-[25px] leading-[30px] font-regular text-white font-bold py-2.5 px-8 bg-[#fe6847] max-w-max rounded-md uppercase ${
                  pathname === "/newsletter" ? "font-bold" : ""
                }`}
              >
                {translation?.[locale]?.iscriviti}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mobile;
