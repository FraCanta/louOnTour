import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import BgAnimation from "../bgAnimation/bgAnimation";
import { Icon } from "@iconify/react/dist/iconify.js";
import CtaPrimary from "../button/CtaPrimary";

const Mobile = ({ translation }) => {
  const { locale, pathname } = useRouter();
  const [open, setOpen] = useState(false); // menu mobile
  const [toursOpen, setToursOpen] = useState(false); // overlay Tours

  const svgVariants = {
    closed: { path: "M4 6h16M4 12h16M4 18h16", transition: { duration: 0.5 } },
    open: { path: "M6 18L18 6M6 6l12 12", transition: { duration: 0.5 } },
  };

  const menuVariants = {
    open: { opacity: 1, height: "100vh", transition: { duration: 0.5 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5 } },
    item: { opacity: 0, y: 50, transition: { duration: 0.3 } },
    visibleItem: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex items-center gap-8">
      {/* Hamburger */}
      <motion.div
        onClick={() => setOpen(!open)}
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

      {/* Mobile Menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="absolute top-0 left-0 right-0 bg-[#fef3ea] min-h-screen w-screen text-principle flex flex-col pt-24"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Bottone Tours */}
            <motion.div className="w-11/12 mx-auto mb-6">
              <button
                onClick={() => setToursOpen(true)}
                className="flex items-center justify-between w-full gap-2 text-3xl tracking-wide menu-item font-regular"
              >
                {translation?.[locale]?.tours}{" "}
                <Icon
                  icon="mdi-light:chevron-right"
                  width="24px"
                  height="24px"
                />
              </button>
            </motion.div>

            {/* Altri link */}
            {[
              { href: "/chi-sono", label: translation?.[locale]?.about },
              { href: "/blog", label: translation?.[locale]?.blog },
            ].map((link, i) => (
              <motion.div
                variants={menuVariants.item}
                animate="visibleItem"
                key={i}
                className="w-11/12 mx-auto mb-6"
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)} // chiude il menu
                  className={`text-3xl tracking-wide menu-item font-regular`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Pulsanti extra */}
            <motion.div className="flex flex-col w-11/12 gap-4 mx-auto mt-6">
              <Link
                href="https://wa.me/393200327355"
                target="_blank"
                title="Luisa Quaglia | Come prenotare e avere info sui tour da fare"
                onClick={() => setOpen(false)} // chiude il menu
                className="w-full flex items-center justify-center max-content text-center text-[#c9573c] tracking-wide  font-medium  leading-snug py-3 px-6  xs:text-lg 3xl:text-3xl rounded-md border-2 border-[#c9573c]"
              >
                {translation?.[locale]?.contact}{" "}
                <Icon
                  icon="basil:whatsapp-outline"
                  width="24"
                  height="24"
                  className="flex-shrink-0"
                />
              </Link>
              <CtaPrimary
                link={`/newsletter`}
                title="I miei articoli"
                onClick={() => setOpen(false)} // chiude il menu
              >
                {translation?.[locale]?.iscriviti}
              </CtaPrimary>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Tours */}
      <AnimatePresence>
        {toursOpen && (
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen bg-[#fef3ea] z-[1000] flex flex-col overflow-y-hidden  py-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          >
            <button
              onClick={() => setToursOpen(false)}
              className="self-end px-4 mb-6 text-2xl font-bold text-principle"
            >
              back
            </button>

            <div className="grid grid-cols-1 gap-6 px-4">
              {translation?.[locale]?.map?.markers.map((el, i) => (
                <Link
                  key={i}
                  href={`/tour/${el?.link}`}
                  onClick={() => {
                    setToursOpen(false);
                    setOpen(false); // chiude anche menu principale
                  }}
                  className="text-lg font-medium text-principle bg-[#CE9486]/20 p-2"
                >
                  {el?.title}
                </Link>
              ))}
              <Link
                href={`/tours-da-fare`}
                onClick={() => {
                  setToursOpen(false);
                  setOpen(false); // chiude anche menu principale
                }}
                className="text-[22px] font-bold mt-4 text-[#C9573C]"
              >
                Tutti i tours &rarr;
              </Link>
            </div>

            {/* BGAnimation sotto */}
            <div className="hero2 min-h-[75vh] w-full">
              <BgAnimation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mobile;
