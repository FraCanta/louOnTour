import Link from "next/link";
import Image from "next/image";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization
import { useState, useEffect } from "react";
import { getDate } from "../../utils/utils";
import { Icon } from "@iconify/react";

export default function Post2({ post, featuredMedia, translation }) {
  const [minutiLettura, setMinutiLettura] = useState(0);

  function calcolaMinutiLettura(testo, velocitaLetturaMedia) {
    const parole = testo.split(" ");
    const paroleLette = parole.filter((parola) => parola.trim() !== "").length;
    const minuti = Math.ceil(paroleLette / velocitaLetturaMedia);
    return minuti;
  }

  useEffect(() => {
    const testoSenzaTag = post?.content?.rendered.replace(/(<([^>]+)>)/gi, ""); // Rimuove i tag HTML dal testo
    const minuti = calcolaMinutiLettura(testoSenzaTag, 250); // Utilizza la velocità di lettura media di 250 parole al minuto
    setMinutiLettura(minuti);
  }, [post]);

  return (
    <div className="w-full  h-full  ">
      <Link href={`/posts/${post?.slug}`} title={`${post?.title?.rendered}`}>
        <figure>
          <Image
            src={featuredMedia?.["media_details"]?.sizes?.full?.["source_url"]}
            width={461}
            height={420}
            alt={featuredMedia?.["alt_text"]}
            className="w-full md:h-[50vw] lg:h-[230px] 3xl:h-[380px] object-cover "
            priority
            quality={70}
          />
        </figure>
      </Link>

      <div className="flex flex-col justify-between mt-4">
        <Link href={`/posts/${post?.slug}`} title={`${post?.title?.rendered}`}>
          <h2
            className="font-bold !text-[#2c395b] pb-2 hover:text-second capitalize text-[5vw] md:text-[4vw] 2xl:text-[1.2vw] fxl:text-[25px] 3xl:pb-6 3xl:text-3xl"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          ></h2>
        </Link>
        <div
          dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}
          className="line-clamp2 !text-para text-[4vw] 2xl:text-[1vw] mb-4 fxl:text-[20px] 3xl:text-[25px]"
        ></div>
        <div className="w-full h-[1px] bg-para/50 "></div>
        <div className="py-2 flex w-full justify-between items-center">
          <small className=" text-para text-md md:text-[2.5vw] 2xl:text-[0.8vw] fxl:text-lg 3xl:text-2xl">
            {getDate(post?.date)}
          </small>

          <div className=" text-para text-md md:text-[2.5vw] 2xl:text-[0.8vw]  3xl:text-lg flex items-center font-bold ml-6">
            <Icon icon="tabler:clock-hour-3" className="mr-2 text-second" />
            <span className=" text-pink text-xs md:text-[2.5vw] 2xl:text-[0.8vw] fxl:text-lg 3xl:text-2xl flex font-bold">
              {" "}
              {minutiLettura} min read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
