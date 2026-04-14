import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/aboutMe.css";
import "../styles/insta.css";
import "../styles/banner.css";
import "../styles/gallery3d.css";
import "../styles/form.css";
import "../styles/testimonials.css";
import "../styles/blog.css";
import "../styles/wordpress.css";
import "../styles/swiper_bullet.css";

import dynamic from "next/dynamic";
const DynamicLayout = dynamic(() => import("../components/layout/layout"));
import Head from "next/head";
import Script from "next/script";
import { AnimatePresence, motion, Spring } from "framer-motion";
import AOS from "aos";
import { useEffect } from "react";

function MyApp({ Component, pageProps, router }) {
  useEffect(() => {
    // here you can add your aos options
    AOS.init({
      offset: 200,
      duration: 500,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <>
      <DynamicLayout>
        <Component {...pageProps} />
      </DynamicLayout>
      {/* <!-- Elfsight Accessibility | Untitled Accessibility --> */}
      <Script src="https://elfsightcdn.com/platform.js" async></Script>

      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        type="text/javascript"
        src="https://embeds.iubenda.com/widgets/465c6cec-2c93-4094-8068-9b9cc0d257e2.js"
      ></Script>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-FJ2J5B3EPX" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());


          gtag('config', 'G-FJ2J5B3EPX');
        `}
      </Script>
    </>
  );
}

export default MyApp;
