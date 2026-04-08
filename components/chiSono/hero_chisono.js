import { motion } from "framer-motion";
import CtaPrimary from "../button/CtaPrimary";
import CtaOutline from "../button/CtaOutline";
import { MaskText } from "../UI/MaskText";
import Image from "next/image";
import LouAvatar from "../../public/assets/lou-avatar.webp";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HeroChiSono({ translation }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-11/12 mx-auto   fxl:py-10  lg:px-10 flex flex-col justify-center  gap-6 lg:gap-20 min-h-[calc(100svh_-_60px)] xl:min-h-[calc(100svh_-_100px)] "
    >
      <motion.div variants={item} className="flex flex-col gap-3 lg:gap-0">
        <motion.div variants={item}>
          <h1 className="text-[2.9vw] lg:text-base font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            Luisa Quaglia Tour Guide | Chi sono
          </h1>
        </motion.div>

        <MaskText>
          <h2 className="text-[5rem] lg:text-[13rem] fxl:text-[17rem] font-bold leading-none py-1.5">
            {translation?.title?.primo}{" "}
          </h2>
        </MaskText>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 lg:grid-cols-2 -mt-[6%] 2xl:-mt-[10%] fxl:-mt-[10%] gap-4 lg:w-3/5  lg:gap-10"
      >
        <div className="flex flex-col justify-between gap-4 lg:px-2 lg:mt-6 fxl:mt-14">
          <MaskText>
            <p className="text-[#c9573c]/80 w-full text-lg lg:text-[1.5rem] fxl:text-3xl 3xl:text-[2.5rem] leading-none 3xl:leading-[3.5rem] mb-5 font-normal">
              {translation?.title?.secondo}
              <br />
              {translation?.title?.terzo}{" "}
            </p>
          </MaskText>
          <div className="flex flex-col gap-4">
            <motion.div
              variants={item}
              className="flex flex-col items-center w-full gap-3 lg:gap-4 lg:flex-row"
            >
              <p className="text-para">{translation?.paragraph}</p>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-col items-center w-full gap-3 lg:gap-4 lg:flex-row"
            >
              <div className="flex justify-center w-full lg:max-w-max">
                <CtaPrimary
                  link="/tours-da-fare"
                  aria-label="Scopri i miei tours"
                >
                  Scopri i miei tours
                </CtaPrimary>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative aspect-square h-[300px] w-full lg:h-full lg:w-full fxl:h-[500px] fxl:w-[500px] rounded-sm shadow-2xl  ">
          <Image
            src={LouAvatar}
            alt="lou_avatar"
            fill
            priority
            className="object-cover "
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HeroChiSono;
