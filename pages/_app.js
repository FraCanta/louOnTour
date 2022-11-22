import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/aboutMe.css";
import "../styles/insta.css";
import "../styles/banner.css";
import "../styles/gallery.css";
import "../styles/form.css";

import Layout from "../components/layout/layout";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
