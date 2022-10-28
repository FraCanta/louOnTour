/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
      fxl: "1900px",
      // => @media (min-width: 1920px) { ... }

      "3xl": "2560px",
      // => @media (min-width: 2560px) { ... }
      "4xl": "3840px",
      // => @media (min-width: 3840px) { ... }
      rotated: { raw: "(max-height: 500px)" },
      // => @media (max-heigh: 3840px) { ... }
    },
  },
  plugins: [],
};
