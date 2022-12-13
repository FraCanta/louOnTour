import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/aboutMe.css";
import "../styles/insta.css";
import "../styles/banner.css";
import "../styles/gallery.css";
import "../styles/form.css";
import "../styles/testimonials.css";
import "../styles/blog.css";

import dynamic from "next/dynamic";
const DynamicLayout = dynamic(() => import("../components/layout/layout"));
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <DynamicLayout>
        <Component {...pageProps} />
      </DynamicLayout>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js" />
    </>
  );
}

export default MyApp;
