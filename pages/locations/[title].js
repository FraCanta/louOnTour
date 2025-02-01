import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
const DynamicHeroCities = dynamic(() =>
  import("../../components/UI/heroCities")
);

const DynamicBanner = dynamic(() =>
  import("../../components/sectionFive/banner")
);
import translationIT from "../../public/locales/it/it.json";
import translationEN from "../../public/locales/en/en.json";
import Gallery3d2 from "../../components/UI/Gallery3D2";
import { MaskText } from "../../components/UI/MaskText";
import CtaPrimary from "../../components/button/CtaPrimary";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Tours({ city, banner }) {
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
      <div className="container flex flex-col w-11/12 py-4 mx-auto lg:flex-row xl:py-8">
        <div className="w-full ">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl">
            Tour {city?.name}
          </h4>
          <MaskText>
            <h1 className="text-4xl md:text-5xl 3xl:text-[100px] font-bold mt-2  text-[#2C395B]">
              {!!city.translatedTitle ? city.translatedTitle : city?.titleImg}
            </h1>
          </MaskText>
        </div>
      </div>
      <DynamicHeroCities city={city} />

      <div className="flex flex-col w-11/12 mx-auto text-xl font-normal text-main xl:text-2xl ">
        {city?.descrizione?.map((el, i) => {
          return (
            <p
              key={i}
              className=" text-para  w-full   text-xl fxl:text-2xl 3xl:text-3xl  3xl:leading-[3.5rem] mb-5 font-regular"
              dangerouslySetInnerHTML={{ __html: el.p }}
            ></p>
          );
        })}
        <ul className="flex flex-col gap-6 elenco_tours">
          {city?.list?.map((el, i) => (
            <li key={i} className="flex">
              <div className="flex flex-col gap-2">
                <h2
                  className="text-2xl font-bold text-principle"
                  dangerouslySetInnerHTML={{ __html: el.l.title }}
                ></h2>
                <p
                  className=" text-para  w-full   text-xl fxl:text-2xl 3xl:text-[2.5rem]  3xl:leading-[3.5rem] mb-5 font-regular"
                  dangerouslySetInnerHTML={{ __html: el.l.descrizione }}
                ></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="container flex justify-end w-11/12 mx-auto mt-10 xl:h-full">
        <CtaPrimary link="/tours-da-fare">
          <Icon icon="lets-icons:refund-back" /> {city.cta}
        </CtaPrimary>
      </div>

      {city?.gallery?.length > 0 && <Gallery3d2 imageArray={city?.gallery} />}

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
  const arr = Object.keys(obj?.tours?.locationTours);

  const correlati = obj?.tours?.corr;

  return {
    props: {
      city: targetObj,
      banner: banner,
      correlati: correlati,
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
