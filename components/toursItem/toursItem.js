import Image from "next/image";
import Link from "next/link";
import React from "react";

const ToursItem = ({ img, name, descrizione, link }) => {
  return (
    <>
      <div className="card w-full lg:w-50  shadow-xl mb-4 lg:mb-0 !pt-0 bg-white">
        <Link href={link}>
          <div className="w-full ">
            <Image
              className="w-full h-[250px] md:h-[450px] lg:h-[300px] object-cover rounded-t-lg object-top "
              src={img}
              width={461}
              height={420}
              alt=""
            />
            <div className="card-body justify-between !p-[1.5rem]">
              <h2 className="card-title text-main  hover:underline text-xl">
                {name}
              </h2>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ToursItem;
