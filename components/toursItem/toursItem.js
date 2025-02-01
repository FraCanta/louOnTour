import Image from "next/image";
import Link from "next/link";
import React from "react";
import CtaPrimary from "../button/CtaPrimary";
import CtaDetails from "../button/CtaDetails";

const ToursItem = ({ img, name, descrizione, link, text }) => {
  return (
    <>
      <Link href={link}>
        <div class="max-w-lg h-full  rounded overflow-hidden border border-principle/50">
          <Image
            src={img}
            alt={`${name} tour img`}
            className="rounded-lg h-[35vh] object-cover w-full p-2"
            width={500}
            height={600}
          />{" "}
          <div class="px-6 py-4 ">
            <h2 class="font-bold text-xl mb-2 text-principle"> {name}</h2>
            <p class="text-para text-base fxl:text-lg">{descrizione} </p>
          </div>
          <div class="px-6 pt-4 pb-8">
            <CtaDetails link={link}>{text}</CtaDetails>{" "}
          </div>
        </div>
      </Link>
    </>
  );
};

export default ToursItem;
