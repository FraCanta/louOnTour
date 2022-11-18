import React, { useState } from "react";
import Image from "next/image";
import Toscana from "../../public/assets/toscana.svg";
import Choose from "../../public/assets/choose.svg";
import { Icon } from "@iconify/react";
import Modal from "../modal/modal";
import Cta from "../button/button";
import Link from "next/link";
const Map = ({ translation }) => {
  const [showModal, setShowModal] = useState({
    isOpen: "hide",
    scale: "",
    title: "",
    video: "",
    link: "",
  });
  const handleModal = (title, video, link) => {
    showModal.isOpen === "hide"
      ? setShowModal({
          isOpen: "",
          scale: "scale-modal",
          title: title,
          video: video,
          link: link,
        })
      : setShowModal({
          isOpen: "hide",
          scale: "",
          title: title,
          video: video,
          link: link,
        });
  };
  return (
    <div className="min-h-[38vh] lg:min-h-[40vh] 3xl:min-h-[80vh]  container mx-auto w-11/12 lg:w-4/5">
      <div className="grid gap-14 md:gap-14 xl:gap-18 grid-cols-1 lg:grid-cols-2 justify-items-center content-center pt-8  overflow-x-hidden lg:overflow-visible">
        <div className="p-0 ">
          <h4 className="text-[#FE6847] text-bold text-xl 3xl:text-4xl">
            Tours
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 3xl:mt-12 leading-10 lg:leading-[4rem] 3xl:leading-[5.5rem] text-[#232F37]">
            Disegnamo insieme il Tuo Tour
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl  mt-4 lg:mt-16 3xl:mt-20 mb-8 text-[#515151] leading-6 2xl:leading-9 3xl:leading-10 mx-auto">
            Qui troverai alcuni tra i tour più popolari, che sono piaciuti a
            molti e che io amo spesso fare! Scegli una location sulla mappa qui
            accanto e dai un’occhiata alle mie proposte di tour: ce ne sono per
            tutti i gusti! Ma se cerchi qualcosa che faccia più al caso tuo,
            contattatami e proveremo insieme a creare il tour che meglio
            soddisfi i tuoi gusti e le tue esigenze.
          </p>
          <Link href="/contatti">
            <Cta>Contattami</Cta>
          </Link>
        </div>

        <div className="pt-0 w-[650px] height-[697.359px] relative ">
          {/* <div className="flex flex-col items-center  absolute -top-10 lg:right-10 right-40">
            <Image src={Choose} alt="brand" className="w-[120px] " />

            <h3 className="uppercase font-medium pt-2 text-lg  text-[0.7rem] 2xl:text-[1rem] text-[#232F37] ">
              Scegli la tua destinazione
            </h3>
          </div> */}
          <Image
            src={Toscana}
            priority
            alt="map"
            width="auto"
            height="auto"
            className="opacity-50"
          />
          <Modal handleModal={handleModal} showModal={showModal} />
          {translation?.markers?.map((el, i) => (
            <div
              key={i}
              className="flex flex-col justify-center absolute items-center"
              style={
                el?.marker?.top > 0
                  ? {
                      top: `${el?.marker?.top}px`,
                      right: `${el?.marker?.right}px`,
                      color: "#FE6847",
                    }
                  : {
                      bottom: `${el?.marker?.bottom}px`,
                      right: `${el?.marker?.right}px`,
                      color: "#FE6847",
                    }
              }
            >
              <Icon
                icon="fontisto:map-marker-alt"
                width="32"
                className={` animate-bounce cursor-pointer`}
                alt={el?.title}
                id={el?.id}
                onClick={() => handleModal(el?.title, el?.video, el?.link)}
              />
              <div className="bg-[#FE6847] w-[6px] h-[6px] absolute rounded-[50%] top-[63%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

              <p className="uppercase text-[0.8rem] text-[#232F37] font-medium py-2">
                {el?.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
