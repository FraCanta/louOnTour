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

import dynamic from "next/dynamic";
const DynamicLayout = dynamic(() => import("../components/layout/layout"));
import Head from "next/head";
import Script from "next/script";
import { AnimatePresence, motion, Spring } from "framer-motion";
import AOS from "aos";
import { useEffect } from "react";

function MyApp({ Component, pageProps, router }) {
  const transitionSpringPhysics = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 10,
  };
  const transitionColor = "white";

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
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={router.route}>
          <motion.div
            style={{
              backgroundColor: transitionColor,
              position: "fixed",
              width: "100vw",
              zIndex: 1000,
              bottom: 0,
            }}
            transition={transitionSpringPhysics}
            animate={{ height: "0vh" }}
            exit={{ height: "100vh" }}
          />

          <motion.div
            style={{
              backgroundColor: transitionColor,
              position: "fixed",
              width: "100vw",
              zIndex: 99999,
              top: 0,
            }}
            transition={transitionSpringPhysics}
            initial={{ height: "100vh" }}
            animate={{ height: "0vh", transition: { delay: 0.2 } }}
          />
          <DynamicLayout>
            <Component {...pageProps} />
          </DynamicLayout>
        </motion.div>
      </AnimatePresence>

      <Script
        type="text/javascript"
        charset="UTF-8"
        src="//cdn.cookie-script.com/s/952906ba33559231ca8c72a6268c0ddb.js"
      />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js" />

      {/* Global site tag (gtag.js) - Google Analytics */}

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
