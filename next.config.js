/**
 * @type {import('next').NextConfig}
 */
const withPlugins = require("next-compose-plugins");

const ContentSecurityPolicy = `
  default-src 'self' https://mcf-integrations-mcmktg.mlchmpcompprduse2.iks2.a.intuit.com/ https://9kvu81ddh3.execute-api.us-east-2.amazonaws.com/ https://eventcollector.mcf-prod.a.intuit.com/ https://form-assets.mailchimp.com/ https://universe-static.elfsightcdn.com/ https://core.service.elfsight.com https://idb.iubenda.com/ https://phosphor.utils.elfsightcdn.com https://widget-data.service.elfsight.com/ https://core.service.elfsight.com/ https://api.iconify.design/ https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css https://region1.google-analytics.com;
  script-src 'self' https://form-assets.mailchimp.com/ https://chimpstatic.com/ https://universe-static.elfsightcdn.com/ https://cdn.iubenda.com/cookie_solution/ https://embeds.iubenda.com/widgets/465c6cec-2c93-4094-8068-9b9cc0d257e2.js https://static.elfsight.com/ https://elfsightcdn.com/ https://storage.googleapis.com http://www.instagram.com/embed.js https://cdnjs.cloudflare.com/ http://cdn.cookie-script.com http://report.cookie-script.com  https://www.googletagmanager.com  https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval';
  child-src 'self' https://luisaquaglia-tourguide.com https://www.instagram.com/ https://www.youtube-nocookie.com/ https://www.google.com/ https://www.youtube.com/;
  style-src 'self' 'unsafe-inline'  https://fonts.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css  data:;
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ 'unsafe-inline' data:;
  img-src 'self' https://form-assets.mailchimp.com/ https://www.googletagmanager.com/ https://phosphor.utils.elfsightcdn.com/ https://luisaquaglia-tourguide.com https://s.w.org/ https://loublog.luisaquaglia-tourguide.com/wp-content/uploads/ https://static.xx.fbcdn.net/ data: blob:;
   object-src 'self' data: blob:;
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

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    largePageDataBytes: 200 * 1000, // Set threshold to 200 kB
  },
  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it",
    localeDetection: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loublog.luisaquaglia-tourguide.com",
      },
      {
        protocol: "https",
        hostname: "loublog.louontour.it",
      },
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/en/locations/Montepulciano e Val d'Orcia",
        destination: "https://www.luisaquaglia-tourguide.com/en/tours-da-fare",
        permanent: true,
      },
      {
        source: "/tours",
        destination: "https://www.luisaquaglia-tourguide.com/tours-da-fare",
        permanent: true,
      },
      {
        source: "/locations/:title",
        destination: "https://www.luisaquaglia-tourguide.com/tours-da-fare",
        permanent: true,
      },
    ];
  },
};

module.exports = withPlugins([], nextConfig);
