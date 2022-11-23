import React from "react";
import ContactForm from "../components/contactPage/contactForm";
import Head from "next/head";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Lou On Tour - Contact</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-11/12 xl:w-4/5 min-h-[30vh] container mx-auto flex flex-col lg:flex-row xl:py-8">
        <div className="w-full lg:w-1/2 p-4 lg:p-8">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl">Contact</h4>
          <h2 className="text-5xl md:text-[64px] 3xl:text-[100px] font-medium mt-2 leading-[3.2rem] lg:leading-[3.5rem] text-[#232F37]">
            Parliamo insieme del Tour che ti piacerebbe fare con me!
          </h2>
        </div>
        <div className="w-full lg:w-1/2 p-4 lg:p-8">
          <p className="text-base sm:text-xl  mt-0 sm:mt-8 mb-4 text-[#232F37]">
            Disegnamo insieme il Tour su misura per Te! Puoi contattarmi
            direttamente tramite:
          </p>
        </div>
      </div>
      <ContactForm />
    </>
  );
};

export default Contact;
