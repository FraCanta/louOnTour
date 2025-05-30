/**
 * @type {import('next').NextConfig}
 */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
const ContentSecurityPolicy = `
  default-src 'self' https://api.iconify.design/ https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css https://region1.google-analytics.com;
  script-src 'self' https://storage.googleapis.com http://www.instagram.com/embed.js https://cdnjs.cloudflare.com/ http://cdn.cookie-script.com http://report.cookie-script.com  https://www.googletagmanager.com  https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval';
  child-src 'self' https://luisaquaglia-tourguide.com https://www.instagram.com/ https://www.youtube-nocookie.com/ https://www.google.com/ https://www.youtube.com/;
  style-src 'self' 'unsafe-inline'  https://fonts.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css  data:;
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ 'unsafe-inline' data:;
  img-src 'self' https://luisaquaglia-tourguide.com https://s.w.org/ https://loublog.luisaquaglia-tourguide.com/wp-content/uploads/ https://static.xx.fbcdn.net/ data: blob:;
  
`;
const securityHeaders = [
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: true,
//   openAnalyzer: true,
// });

module.exports = withPlugins([
  nextConfig,

  {
    i18n: {
      locales: ["it", "en"],
      defaultLocale: "it",
      localeDetection: true,
    },
  },
  {
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
  },
  {
    images: {
      formats: ["image/avif", "image/webp"],
      domains: ["loublog.luisaquaglia-tourguide.com", "loublog.louontour.it"],
    },
  },
  // withBundleAnalyzer,
  async function redirects() {
    return [
      {
        source: "/en/locations/Montepulciano%20e%20Val%20d'Orcia",
        destination: "https://www.luisaquaglia-tourguide.com/en/tours-da-fare",
        permanent: true,
      },
      {
        source: "/tours",
        destination: "https://www.luisaquaglia-tourguide.com/tours-da-fare",
        permanent: true,
      },
      {
        source: "/locations/[title]",
        destination: "https://www.luisaquaglia-tourguide.com/tours-da-fare",
        permanent: true,
      },
    ];
  },
]);
