import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;1,400&family=Oswald:wght@300;400;500;600;700&family=Yrsa:wght@500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css"
        ></link>

        <title>Lou On Tour - Guida Turistica</title>
        <meta name="description" content="Guida Turistica" />

        <meta property="og:url" content="https://www.louontour.it/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lou On Tour - Guida Turistica" />
        <meta property="og:description" content="Guida Turistica" />
        <meta
          property="og:image"
          content="https://louontour.it/assets/preview-05.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="louontour.it" />
        <meta property="twitter:url" content="https://www.louontour.it/" />
        <meta name="twitter:title" content="Lou On Tour - Guida Turistica" />
        <meta name="twitter:description" content="Guida Turistica" />
        <meta
          name="twitter:image"
          content="https://louontour.it/assets/preview-05.png"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
