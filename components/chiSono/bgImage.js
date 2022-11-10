import React from "react";

const BgImage = () => {
  return (
    <>
      <div className="bgImage w-full xl:w-4/5 mx-auto"></div>
      <div className="text-left 2xl:text-center ">
        <div className="container w-4/5 md:w-4/5 mx-auto">
          <div className="mx-auto relative z-1">
            <div>
              <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl   mt-4 sm:mt-16 mb-20 text-[#515151] leading-6 2xl:leading-9 mx-auto">
                Amo questo lavoro e amo farlo in Toscana, una Regione dove arte,
                storia, natura e tradizioni sono perfettamente bilanciate.
                Infatti, con mio marito, che è una guida ambientale,
                organizziamo anche qualche camminata in natura. Se ti va di
                rimanere aggiornato sulle nostre uscite iscriviti alla mailing
                list! Spero di conoscerti presto in Toscana. Nell’attesa mi
                trovi tutti i giorni sui social. <br />A presto, Luisa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BgImage;
