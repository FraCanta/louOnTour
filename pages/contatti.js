import React from "react";
import ContactForm from "../components/contactPage/contactForm";
import Head from "next/head";
// import Transition from "../components/transition/transition";
// import gsap from "gsap";

const Contact = () => {
  // const contact = gsap.timeline(); // prima timeline per transition della pagina

  return (
    <>
      <Head>
        <title>Lou On Tour - Contact</title>
        <meta name="description" content="Guida Turistica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContactForm />
      {/* <Transition timeline={contact} /> */}
    </>
  );
};

export default Contact;
