import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"), { ssr: false });
const DynamicMenu = dynamic(() => import("./menu"), { ssr: false });
import LayoutTranslation from "../../public/locales/layout.json";
import Script from "next/script";
const LenisScroll = dynamic(() => import("../LenisScroll/LenisScroll"), {
  ssr: false,
});
function Layout({ children }) {
  return (
    <>
      <LenisScroll />

      <DynamicMenu translation={LayoutTranslation?.menu} />
      <Script
        id="mcjs"
        strategy="afterInteractive"
        src="https://chimpstatic.com/mcjs-connected/js/users/23d6ce9b211aa205189c78058/73622c583c1efde2309feee86.js"
      />
      {children}
      <DynamicFooter translation={LayoutTranslation} />
    </>
  );
}

export default Layout;
