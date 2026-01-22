import Image from "next/image";
import Toscana from "../../public/assets/toscana.svg";
import { Icon } from "@iconify/react";
import Link from "next/link";
import CtaPrimary from "../button/CtaPrimary";
import { MaskText } from "../UI/MaskText";
const Map = ({ translation }) => {
  return (
    <div className="min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]   w-11/12 mx-auto">
      <div className="grid items-center content-center grid-cols-1 pt-12 overflow-x-hidden gap-14 md:gap-14 xl:gap-18 lg:grid-cols-2 justify-items-center 2xl:pt-10 lg:overflow-visible">
        <div className="w-full max-w-2xl p-0 mx-auto">
          <h3 className="text-[#FE6847] uppercase text-xl 3xl:text-4xl">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-5xl 3xl:text-[100px] font-bold mt-2 3xl:mt-12 3xl:leading-[5.5rem] text-[#2C395B]">
              {translation?.title}
            </h2>
          </MaskText>
          <p className="mx-auto mt-4 mb-8 text-base text-para 2xl:text-xl 3xl:text-3xl lg:mt-8 3xl:mt-20">
            {translation?.paragraph}
          </p>
          <CtaPrimary link="/contatti">{translation?.button}</CtaPrimary>
        </div>

        <div className="pt-0 w-[650px] height-[697.359px] relative ">
          <Image
            src={Toscana}
            alt="map"
            width="auto"
            height="auto"
            className="opacity-80"
          />
          {translation?.markers?.map((el, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center justify-center"
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
              {el?.link?.length > 0 && (
                <Link href={`/locations/${el?.link}`}>
                  <Icon
                    icon="fontisto:map-marker-alt"
                    width="32"
                    className={` animate-bounce cursor-pointer`}
                    alt={el?.title}
                    id={el?.id}
                  />
                </Link>
              )}
              {el?.link?.length > 0 && (
                <div className="bg-[#FE6847] w-[6px] h-[6px] absolute rounded-[50%] top-[63%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              )}

              <h4 className="uppercase text-[0.7rem] text-[#2C395B] font-bold py-2">
                {el?.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
