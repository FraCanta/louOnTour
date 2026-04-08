import { motion } from "framer-motion";
import Head from "next/head";
import translationIT from "../public/locales/it/it.json";
import translationEN from "../public/locales/en/en.json";
import ToursItem from "../components/toursItem/toursItem";
import Banner from "../components/sectionFive/banner";
import Map from "../components/sectionTwo/map";
import { MaskText } from "../components/UI/MaskText";
import { Icon } from "@iconify/react/dist/iconify.js";
import AboutMe from "../components/sectionThree/aboutMe";

const Tours = ({ translation }) => {
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
        <title>{translation?.head?.title}</title>
        <meta name="description" content={translation?.head?.description} />
        <meta
          property="og:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={translation?.head?.title} />
        <meta
          property="og:description"
          content={translation?.head?.description}
        />

        <meta
          property="og:image"
          content="https://luisaquaglia-tourguide.com/assets/lou-avatar.webp"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="luisaquaglia-tourguide.com" />
        <meta
          property="twitter:url"
          content="https://www.luisaquaglia-tourguide.com/"
        />
        <meta name="twitter:title" content={translation?.head?.title} />
        <meta
          name="twitter:description"
          content={translation?.head?.description}
        />
        <meta
          name="twitter:image"
          content="https://luisaquaglia-tourguide.com/assets/lou-avatar.webp"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-11/12 mx-auto py-10 lg:py-0 lg:px-10 flex flex-col md:flex-row lg:items-center gap-6 lg:gap-20 min-h-[calc(100svh_-_60px)] xl:min-h-[calc(90svh_-_70px)] "
      >
        <motion.div variants={item}>
          <motion.div
            variants={item}
            className="flex items-center justify-between w-full lg:justify-start lg:gap-4"
          >
            <h1 className="text-[2.9vw] lg:text-base font-semibold px-3 lg:px-4 py-2 bg-[#CE9486]/20 rounded-full lg:max-w-max tracking-wide">
              Luisa Quaglia Tour Guide | Tours da fare
            </h1>
          </motion.div>

          <MaskText>
            <h2 className="text-[2.3rem] xs:text-[2.2rem] lg:text-[4rem] 2xl:text-[4.5rem] fxl:text-[5rem] font-bold leading-none max-w-7xl py-1.5">
              Tour su misura per te con guida esperta
            </h2>
          </MaskText>

          <MaskText>
            <p className="text-para w-full text-base lg:text-[1.25rem]   leading-snug mb-5 font-normal">
              Dai borghi medievali alle città iconiche, ogni tour è pensato per
              farti vivere la cultura, la storia e i paesaggi unici della
              Toscana, al tuo ritmo e secondo i tuoi desideri.
            </p>
          </MaskText>
        </motion.div>
        <motion.div
          variants={item}
          className="relative flex items-center justify-end w-full aspect-square"
        >
          <video
            src="/assets/hero_tour.mp4"
            autoPlay
            loop
            muted
            className="object-cover w-full h-full rounded-sm"
          />
        </motion.div>
      </motion.div>
      <section className="grid w-11/12 grid-cols-1 gap-10 mx-auto my-20 lg:grid-cols-3">
        <div className="flex flex-col items-center gap-2">
          <Icon
            icon="hugeicons:twin-tower"
            width="50px"
            height="50px"
            className="text-principle "
          />
          <h4 className="text-4xl text-principle">Bellezze senza tempo</h4>
          <p className="mx-auto text-lg leading-snug text-center lg:w-1/2 text-para">
            Borghi e paesaggi che ti lasciano senza fiato
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon
            icon="octicon:book-24"
            width="50px"
            height="50px"
            className="text-principle "
          />
          <h4 className="text-4xl text-principle">Storie e leggende</h4>
          <p className="mx-auto text-lg leading-snug text-center lg:w-1/2 text-para">
            Scopri miti e tesori nascosti ad ogni passo
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Icon
            icon="lineicons:trees-3"
            width="50px"
            height="50px"
            className="text-principle "
          />
          <h4 className="text-4xl text-principle">Cultura autentica</h4>
          <p className="mx-auto text-lg leading-snug text-center lg:w-1/2 text-para">
            Assapora tradizioni e atmosfere locali uniche
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  w-[90%] mx-auto min-h-[40vh] gap-4 ">
        {translation?.tourItem?.map((el, i) => {
          return (
            <ToursItem
              key={i}
              img={el?.img}
              link={el?.link}
              name={el.name}
              descrizione={el.descrizione}
              text={el.text}
            />
          );
        })}
      </section>
      <AboutMe translation={translation.about} />

      <Banner translation={translation?.banner} />
    </>
  );
};

export default Tours;

export async function getStaticProps(locale, context) {
  let obj;
  switch (locale.locale) {
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

  return {
    props: {
      translation: obj?.tours,
    },
    revalidate: 60,
  };
}
