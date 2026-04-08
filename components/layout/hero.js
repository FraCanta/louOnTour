import { motion } from "framer-motion";
import CtaPrimary from "../button/CtaPrimary";
import CtaOutline from "../button/CtaOutline";
import { MaskText } from "../UI/MaskText";
import Masonry from "../sectionFour/masonry";

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

const Hero = ({ translation }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-11/12 mx-auto py-10 lg:py-0 lg:px-10 flex flex-col md:flex-row lg:items-center gap-6 lg:gap-20 min-h-[calc(100svh_-_60px)] xl:h-[calc(100svh_-_100px)] "
    >
      <motion.div variants={item} className="flex flex-col gap-3 lg:gap-4">
        <motion.div
          variants={item}
          className="flex items-center justify-between w-full lg:justify-start lg:gap-4"
        >
          <h1 className="text-[2.9vw] lg:text-base font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide">
            Luisa Quaglia Tour Guide | Tuscany Experience
          </h1>

          <div className="flex items-center gap-1 px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="#DEB058"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <p className="ms-2 text-[2.9vw] lg:text-sm font-bold text-[#c9573c]">
              5.0
            </p>
          </div>
        </motion.div>

        <MaskText>
          <h2 className="text-[2.6rem] lg:text-[4rem] fxl:text-[5.5rem] font-bold leading-none max-w-7xl py-1.5">
            {translation?.name}
          </h2>
        </MaskText>

        <MaskText>
          <p className="text-[#c9573c]/80 w-full text-lg lg:text-[1.2rem] xl:text-[1.5rem] 3xl:text-[2.5rem] leading-6 2xl:leading-9 3xl:leading-[3.5rem] mb-5 font-normal">
            {translation?.paragraph}
          </p>
        </MaskText>

        <motion.div
          variants={item}
          className="flex flex-col items-center w-full gap-3 lg:gap-4 lg:flex-row"
        >
          <div className="flex justify-center w-full lg:max-w-max">
            <CtaPrimary link="mailto:luisaquaglia.tourguide@gmail.com">
              {translation?.cta}
            </CtaPrimary>
          </div>
          <div className="flex justify-center w-full lg:max-w-max">
            <CtaOutline link="/tours-da-fare">
              {translation?.tourcta}
            </CtaOutline>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={item}
        className="relative flex items-center justify-end w-full h-full"
      >
        <Masonry />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
