import Image from "next/image";
import Link from "next/link";

const ToursItem = ({ img, name, descrizione, link, text }) => {
  return (
    <>
      <Link
        href={link}
        className="relative flex flex-col justify-end overflow-hidden transition-shadow duration-300 rounded-sm shadow-lg aspect-square"
      >
        <Image
          src={img}
          alt={`${name} tour img`}
          className="relative object-cover w-full h-full media-wrapper"
          width={500}
          height={600}
        />{" "}
        <div className="absolute inset-0 bg-[linear-gradient(359.99deg,rgba(201,87,60,0.8)_1.62%,rgba(201,87,60,0)_65.37%)]"></div>
        {/* Titolo */}
        <div className="absolute left-0 flex items-center justify-center w-full bottom-6 lg:bottom-14">
          <h2 className="text-3xl font-bold text-center text-white lg:text-4xl fxl:text-5xl">
            {name}
          </h2>
        </div>
      </Link>
    </>
  );
};

export default ToursItem;
