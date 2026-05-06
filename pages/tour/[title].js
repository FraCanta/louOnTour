import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicBanner = dynamic(
  () => import("../../components/sectionFive/banner"),
);
import translationIT from "../../public/locales/it/it.json";
import translationEN from "../../public/locales/en/en.json";
import { MaskText } from "../../components/UI/MaskText";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MapCards from "../../components/MapCards/MapCards";

export default function Tours({ city, banner }) {
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
  return (
    <>
      <Head>
        <title>{city?.title}</title>
        <meta name="description" content={city?.descrizione2} />
        <meta name="keywords" content={city?.keywords} />

        <meta
          property="og:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={city?.title} />
        <meta property="og:description" content={city?.descrizione2} />

        <meta
          property="og:image"
          content={`https://luisaquaglia-tourguide.com${city?.img}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="luisaquaglia-tourguide.com" />
        <meta
          property="twitter:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta name="twitter:title" content={city?.title} />
        <meta name="twitter:description" content={city?.descrizione2} />
        <meta name="twitter:image" content={city?.img} />
      </Head>
      <div className="w-11/12 qhd:max-w-[2304px] px-4 mx-auto mt-10 qhd:mt-14 mb-10 lg:px-10 qhd:px-0">
        <Link
          href="/tours-da-fare"
          className="flex items-center gap-2 text-xl qhd:text-3xl text-principle"
        >
          <Icon icon="lets-icons:refund-back" /> {city?.cta}
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-11/12 qhd:max-w-[2304px] mx-auto lg:py-0 lg:px-10 qhd:px-0 flex flex-col md:flex-row lg:items-center gap-6 lg:gap-20 qhd:gap-28 min-h-[calc(50svh_-_60px)] xl:min-h-[calc(70svh_-_70px)] qhd:min-h-[calc(70svh_-_133px)]"
      >
        <motion.div variants={item}>
          <motion.div
            variants={item}
            className="flex items-center justify-between w-full lg:justify-start lg:gap-4"
          >
            <h1 className="text-sm lg:text-base qhd:text-xl font-semibold px-3 lg:px-4 qhd:px-5 py-2 qhd:py-3 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide">
              {city?.title}
            </h1>
          </motion.div>

          <MaskText>
            <h2
              dangerouslySetInnerHTML={{
                __html: !!city.translatedTitle
                  ? city.translatedTitle
                  : city?.titleImg,
              }}
              className="text-[2.5rem] lg:text-[4rem] 2xl:text-[4.5rem] fxl:text-[5rem] qhd:text-[6.6rem] font-bold leading-none max-w-7xl py-1.5"
            ></h2>
          </MaskText>
        </motion.div>
        <motion.div
          variants={item}
          className="relative flex items-center justify-end w-full aspect-square lg:aspect-video"
        >
          <Image
            src={city?.img}
            alt={city?.title}
            layout="fill"
            objectFit="cover"
            className="rounded-sm"
          />
        </motion.div>
      </motion.div>

      <section className="w-11/12 gap-6 py-10 mx-auto lg:py-24 qhd:py-32 lg:max-w-7xl qhd:max-w-[1800px]">
        <p className="text-xl italic leading-snug text-center lg:text-5xl qhd:text-6xl qhd:leading-tight text-para/50">
          {city?.citazione}
        </p>
      </section>
      <div className="flex flex-col w-11/12 qhd:max-w-[2100px] mx-auto text-base qhd:text-2xl qhd:leading-10 font-normal lg:px-10 qhd:px-0 text-main xl:text-lg ">
        {city?.descrizione?.map((el, i) => {
          return (
            <p
              key={i}
              className="w-full mb-5 text-para font-regular"
              dangerouslySetInnerHTML={{ __html: el.p }}
            ></p>
          );
        })}
        <ul className="flex flex-col gap-6 elenco_tours">
          {city?.list?.map((el, i) => (
            <li key={i} className="flex">
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xl qhd:text-4xl font-bold text-principle"
                  dangerouslySetInnerHTML={{ __html: el.l.title }}
                ></h2>
                <p
                  className="text-para w-full text-base lg:text-lg qhd:text-2xl qhd:leading-10 3xl:text-[2.5rem] 3xl:leading-[3.5rem] mb-5 font-regular"
                  dangerouslySetInnerHTML={{ __html: el.l.descrizione }}
                ></p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {city?.tourItem?.length > 0 && (
        <div className="mt-10 lg:h-screen lg:mt-20">
          {" "}
          <MapCards translation={city} />
        </div>
      )}

      <DynamicBanner translation={banner} />
    </>
  );
}

export async function getStaticProps(context) {
  const { params, locale } = context;
  let obj;

  switch (locale) {
    case "it":
      obj = translationIT;
      break;

    case "en":
      obj = translationEN;
      break;
    default:
      obj = translationIT;
      break;
  }

  let targetObj = obj?.tours?.locationTours?.[params?.title];
  const banner = obj?.home?.banner;

  return {
    props: {
      city: targetObj,
      banner: banner,
    },
  };
}

export async function getStaticPaths({ locale }) {
  let obj;

  switch (locale) {
    case "it":
      obj = translationIT;
      break;

    case "en":
      obj = translationEN;
      break;
    default:
      obj = translationIT;
      break;
  }
  const cities = obj?.tours?.locationTours;
  const arr = Object.keys(cities); // Array dei tours

  const pathEn = arr?.map((el) => {
    return {
      params: {
        title: el,
      },
      locale: "en",
    };
  });
  const pathIt = arr?.map((el) => {
    return {
      params: {
        title: el,
      },
      locale: "it",
    };
  });
  const paths = pathIt.concat(pathEn);

  return {
    paths,
    fallback: false,
  };
}
