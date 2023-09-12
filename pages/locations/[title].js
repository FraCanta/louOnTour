import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
const DynamicHeroCities = dynamic(() =>
  import("../../components/UI/heroCities")
);
// import locations from "../../public/locales/it/it.json"; ???????
// const DynamicGalleryTours = dynamic(() =>
//   import("../../components/UI/galleryTours")
// );
const DynamicSimpleGallery = dynamic(() =>
  import("../../components/UI/simpleGallery")
);
const DynamicCorrelati = dynamic(() => import("../../components/UI/correlati"));
const DynamicBanner = dynamic(() =>
  import("../../components/sectionFive/banner")
);
import translationIT from "../../public/locales/it/it.json";
import translationEN from "../../public/locales/en/en.json";

export default function Tours({ city, others, banner, correlati }) {
  console.log(city?.gallery);
  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${city?.titleImg}`}</title>
      </Head>
      <div className="w-full xl:w-4/5 min-h-[30vh] container mx-auto flex flex-col lg:flex-row py-4 xl:py-8">
        <div className="w-full lg:w-1/2 p-4 lg:p-8">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl">Destinations</h4>
          <h2 className="text-5xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 leading-[3.2rem] lg:leading-[3.5rem] text-[#2C395B]">
            {!!city.translatedTitle ? city.translatedTitle : city?.titleImg}
          </h2>
        </div>
        <div className="w-full lg:w-1/2 p-4 lg:p-8">
          <p className="text-base sm:text-lg  mt-0 sm:mt-8 mb-4 text-[#2C395B]">
            {city?.descrizione}
          </p>
        </div>
      </div>
      <DynamicHeroCities city={city} />
      <div className="min-h-[50vh] py-0 lg:py-4 ">
        <div className="container w-11/12 xl:w-4/5 mx-auto xl:h-full ">
          <div className="flex flex-col lg:flex-row w-full justify-between">
            <div
              className="w-full lg:w-1/2  lg:px-8 lg:p-4 pt-8 xl:pt-0"
              style={city?.half_elenco?.length === 0 ? { display: "none" } : {}}
            >
              <h3 className="text-3xl md:text-[30px] font-medium mt-2 leading-10 text-[#2C395B] pb-8">
                {city?.half}
              </h3>
              <ul className="text-xl md:text-base font-medium mt-2 leading-10  text-[#2C395B] pb-10 elenco_tours">
                {city?.half_elenco?.map((el, i) => (
                  <li
                    key={i}
                    className="text-base sm:text-[1.05rem]  mt-4 sm:mt-8 text-[#2C395B]"
                  >
                    <div dangerouslySetInnerHTML={{ __html: el }}></div>
                  </li>
                ))}
              </ul>

              {!!city?.ticket && (
                <div className="text-xl md:text-lg font-medium mt-2 leading-10  pb-8 ticket">
                  <Link href={city?.ticket} target="_blank" rel="noreferrer">
                    Info
                  </Link>
                </div>
              )}
            </div>
            <div
              className="w-full lg:w-1/2  lg:px-8 lg:p-4 pt-8 xl:pt-0"
              style={city?.half_elenco?.length === 0 ? { width: "100%" } : {}}
            >
              <h3 className="text-3xl md:text-[30px] font-medium mt-2 leading-10 text-[#2C395B] pb-8">
                {city?.full}
              </h3>
              <ul className="text-xl md:text-base font-medium mt-2 leading-10 text-[#2C395B] pb-8 elenco_tours">
                {city?.full_elenco?.map((el, i) => (
                  <li
                    key={i}
                    className="text-base sm:text-[1.05rem]  mt-0 sm:mt-8 text-[#2C395B] pb-2"
                  >
                    <div dangerouslySetInnerHTML={{ __html: el }}></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {city?.gallery?.length > 0 && (
        // <DynamicGalleryTours imageArray={city?.gallery} />
        <DynamicSimpleGallery
          imageArray={city?.gallery}
          galleryID="gallery--click-to-next"
          galleryTitle={"Gallery"}
        />
      )}

      <DynamicCorrelati city={city} others={others} correlati={correlati} />
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
  const others = arr?.map((el) => {
    return {
      title: el,
      img: obj?.tours?.locationTours?.[el]?.img,
      link: `/locations/${el}`,
      translatedTitle: obj?.tours?.locationTours?.[el]?.translatedTitle || null,
    };
  });
  const correlati = obj?.tours?.corr;

  return {
    props: {
      city: targetObj,
      others: others,
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
