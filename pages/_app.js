import "../styles/globals.css";
import "../styles/modal.css";

import Layout from "../components/layout/layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
