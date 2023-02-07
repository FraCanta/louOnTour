import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/aboutMe.css";
import "../styles/insta.css";
import "../styles/banner.css";
import "../styles/gallery.css";
import "../styles/form.css";
import "../styles/testimonials.css";
import "../styles/blog.css";
import "../styles/wordpress.css";

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
      <Script
        type="text/javascript"
        charset="UTF-8"
        src="https://cdn.cookie-script.com/s/9ef9f8d308f4c038f81b632b812d9a4d.js"
      />
      {/* <script type="text/javascript" charset="UTF-8" src="//cdn.cookie-script.com/s/9ef9f8d308f4c038f81b632b812d9a4d.js"></script> */}
    </>
  );
}

export default MyApp;
