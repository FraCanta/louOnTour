/**
 * @type {import('next').NextConfig}
 */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};
const ContentSecurityPolicy = `
  default-src 'self' https://api.iconify.design/ https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css https://region1.google-analytics.com/g/collect?v=2&tid=G-FJ2J5B3EPX&gtm=45je32m0&_p=619933021&cid=538657379.1677346703&ul=it&sr=360x640&uaa=&uab=64&uafvl=Chromium%3B110.0.5481.177%7CNot%2520A(Brand%3B24.0.0.0%7CGoogle%2520Chrome%3B110.0.5481.177&uamb=1&uam=Moto%20G%20(4)&uap=Android&uapv=6.0.1&uaw=0&_s=1&sid=1677346702&sct=1&seg=0&dl=https%3A%2F%2Fwww.louontour.it%2Fcontatti&dt=Lou%20On%20Tour%20-%20Contatti&en=page_view&_fv=1&_nsi=1&_ss=1&_ee=1;
  script-src 'self' https://storage.googleapis.com http://www.instagram.com/embed.js https://cdnjs.cloudflare.com/ http://cdn.cookie-script.com http://report.cookie-script.com  https://www.googletagmanager.com/gtag/js?id=G-FJ2J5B3EPX  https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval';
  child-src 'self' https://louontour.it https://www.instagram.com/ https://www.youtube-nocookie.com/ https://www.google.com/ https://www.youtube.com/;
  style-src 'self' 'unsafe-inline'  https://fonts.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css  data:;
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com/ 'unsafe-inline' data:;
  img-src 'self' https://louontour.it https://s.w.org/ https://loublog.louontour.it/wp-content/uploads/ https://static.xx.fbcdn.net/ data: blob:;
  
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
      domains: ["loublog.louontour.it"],
    },
  },
  // withBundleAnalyzer,
]);
