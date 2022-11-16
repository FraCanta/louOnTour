import Head from "next/head";
import Link from "next/link";
import HeroCities from "../../components/UI/heroCities";
import locations from "../../public/locales/it/it.json";

export default function Tours({ city }) {
  return (
    <>
      <Head>
        <title>{`Lou On Tour - ${city?.title}`}</title>
      </Head>
      <div className="w-full xl:w-4/5 min-h-[30vh] container mx-auto flex flex-col xl:flex-row xl:py-8">
        <div className="w-full xl:w-1/2 p-8">
          <h6 className="text-[#FE6847]">Destinations</h6>
          <h2 className="text-4xl sm:text-6xl font-bold font-medium mt-2 leading-10 text-[#232F37]">
            Consigli Utili
          </h2>
        </div>
        <div className="w-full xl:w-1/2 p-8">
          <p className="text-base sm:text-lg text-slate-blue mt-0 sm:mt-8 mb-4 text-white text-black">
            I tour qui elencati sono tutti di mezza giornata, fatta eccezione
            per il tour della Val d’Orcia che prevede una giornata intera. Nulla
            toglie, però, che tu possa combinare più visite in una giornata in
            posti diversi. Ti lascio una mappa che puoi scaricare
            tranquillamente con i tempi di percorrenza tra i vari borghi e
            città. Ricorda però che nel caso tu voglia organizzare una intera
            giornata di tour avrai bisogno di una macchina o un driver perché i
            collegamenti con i mezzi pubblici, soprattutto tra i borghi, non
            sono frequenti. Mentre per Firenze e Siena ci sono diverse opzioni
            utili.
          </p>
        </div>
      </div>
      <HeroCities city={city} />
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
