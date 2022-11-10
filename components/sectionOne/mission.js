import React from "react";

const Mission = () => {
  return (
    <div className="min-h-[100vh] text-center pt-2 2xl:pt-0 flex items-center justify-center">
      <div className="container w-4/5 md:w-4/5 mx-auto pt-12 md:pt-2 xl:h-full ">
        <div className="mx-auto relative z-1">
          <div>
            <h4 className="text-[#E3494D] text-bold">Mission</h4>
            <h2 className="text-4xl md:text-[64px] font-medium mt-2 leading-10 text-[#232F37]">
              Welcome to Lou On Tour
            </h2>
            <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl   mt-4 sm:mt-16 mb-8 text-[#515151] leading-6 2xl:leading-9  mx-auto">
              Queste ultime esperienze mi hanno fatto apprezzare
              la divulgazione, quindi ho deciso di diventare una guida
              turistica: la scelta migliore della mia vita! Amo incontrare
              persone nuove e condividere con loro la mia passione per la storia
              e l’arte. Incontro persone che vengono da tutta Italia e
              dall’estero: un’occasione questa per me, per conoscere altre
              storie e culture, una sorta di viaggio senza fine, fantastico!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
