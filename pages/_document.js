import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charset="UTF-8" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;1,400&family=Oswald:wght@300;400;500;600;700&family=Yrsa:wght@500&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>

        <meta name="application-name" content="Lou On Tour - Guida Turistica" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Lou On Tour - Guida Turistica"
        />
        <meta name="description" content="Lou On Tour - Guida Turistica" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ffff" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
