import Head from "next/head";
import Link from "next/link";
import HeroCities from "../../components/UI/heroCities";
import locations from "../../public/locales/it/it.json";
import Transition from "../../components/transition/transition";
// import gsap from "gsap";
import { Icon } from "@iconify/react";

export default function Tours({ city }) {
  // const tours = gsap.timeline(); // prima timeline per transition della pagina

  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${city?.title}`}</title>
      </Head>
      <div className="w-full xl:w-4/5 min-h-[30vh] container mx-auto flex flex-col xl:flex-row xl:py-8">
        <div className="w-full xl:w-1/2 p-8">
          <h6 className="text-[#FE6847]">Destinations</h6>
          <h2 className="text-4xl sm:text-6xl font-bold font-medium mt-2 leading-10 text-[#232F37]">
            {city?.titleImg}
          </h2>
        </div>
        <div className="w-full xl:w-1/2 p-8">
          <p className="text-base sm:text-lg text-slate-blue mt-0 sm:mt-8 mb-4 text-white text-black">
            {city?.descrizione}
          </p>
        </div>
      </div>
      <HeroCities city={city} />
      {/* <div className="w-4/5  container mx-auto flex flex-col xl:flex-row xl:py-8 "> */}
      {/* <p className="text-lg text-black">{city?.descrizione}</p> */}
      {/* </div> */}
      <div className="min-h-[50vh]  ">
        <div className="container w-full md:w-4/5 mx-auto md:pt-2 xl:h-full p-8">
          <div className="mx-auto relative z-1">
            <div>
              <h3 className="text-4xl md:text-[40px] font-medium mt-2 leading-10 text-[#232F37] pb-8">
                {city?.title}
              </h3>
              <ul className="text-xl md:text-lg font-medium mt-2 leading-10 text-[#232F37] pb-8 elenco_tours">
                {city?.elenco?.map((el, i) => (
                  <li key={i} className="pb-8">
                    <div dangerouslySetInnerHTML={{ __html: el }}></div>
                  </li>
                ))}
              </ul>
              {!!city?.ticket && (
                <div className="text-xl md:text-lg font-medium mt-2 leading-10 text-[#FE6847] pb-8 underline">
                  <Link href={city?.ticket} target="_blank" rel="noreferrer">
                    Biglietto qui
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <Transition timeline={tours} /> */}
    </>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  let targetObj = locations?.tours?.[params?.title];

  return {
    props: {
      city: targetObj,
    },
  };
}

export async function getStaticPaths() {
  const cities = locations?.tours;
  const arr = Object.keys(cities); // Array dei tours

  const paths = arr?.map((el) => {
    return {
      params: {
        title: el,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
