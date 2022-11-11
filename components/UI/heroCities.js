import React from "react";

const HeroCities = () => {
  return (
    <>
      <div className="container mx-auto w-4/5 min-h-[50vh] rounded-xl bgCities flex items-end p-8 text-white text-5xl ">
        Cities
      </div>
      <div className="contaner mx-auto w-4/5  mt-8 py-8">
        <p>
          Questa città posizionata in cima ad una collina è famosa per il suo
          centro storico tutelato dall’Unesco visto che ancora mantiene buona
          parte dell’assetto urbano medievale; è famosa per lo sfarzo artistico
          e architettonico soprattutto in epoca medievale; è la città del Palio,
          corsa di cavallo più famosa d’Italia. Qui è anche nata Santa Caterina
          ed è stata fondata la banca più longeva al mondo.
        </p>
      </div>
      <div className="contaner mx-auto w-4/5  mt-8 py-8">
        <p>
          {" "}
          1. Siena per “principianti”: saremo in giro circa 2 ore per conoscere
          i luoghi principali, i personaggi, gli aneddoti e gli eventi che hanno
          reso famosa questa città. 2. Siena Insolita: 3 ore circa di tour che
          ti permetteranno di conoscere i luoghi emblematici della città ma
          anche i luoghi meno frequentati dai visitatori. Se decidi di visitare
          la sede di una contrada potrai immergerti nella realtà senese, avere
          contatto con la gente del posto. Ma un altro modo per immergerti nel
          tessuto locale è senz’altro attraverso suoi prodotti locali:
          organizziamo un assaggio? 3. A Siena con arte: abbiamo 3 ore a
          disposizione per una passeggiata per conoscere i punti salienti della
          città e un approfondimento in un museo a tua scelta. Qui di seguito
          hai i link dei principali musei senesi: - Cattedrale + complesso del
          Duomo - Museo civico - Ex Ospedale Santa Maria della Scala + Museo
          Archeologico - Pinacoteca Nazionale
        </p>
      </div>
    </>
  );
};

export default HeroCities;
