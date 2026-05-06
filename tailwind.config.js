/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],

  theme: {
    screens: {
      "2xs": "320px",
      xs: "375px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1500px",
      // => @media (min-width: 1536px) { ... }
      "2xla": "1650px",
      // => @media (min-width: 1680px) { ... }
      fxl: "1920px",
      // => @media (min-width: 1920px) { ... }

      qhd: { raw: "(min-width: 2500px) and (max-width: 2879px) and (max-height: 1700px)" },
      // => ottimizzazione per display tipo 2560 x 1440

      "3xl": "2880px",
      // => @media (min-width: 2880px) { ... }
      "4xl": "3840px",
      // => @media (min-width: 3840px) { ... }
    },
    colors: {
      principle: "#C9573C",
      second: "#77674E",
      white: "#ffff",
      para: "#77674E",
    },
  },
};
