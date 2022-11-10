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
      <ContactForm />
    </>
  );
};

export default Contact;
