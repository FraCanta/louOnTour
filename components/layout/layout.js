import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicMenu = dynamic(() => import("./menu"));
const DynamicBackToTop = dynamic(() => import("./backToTop"));
const DynamicWhatsapp = dynamic(() => import("./whatsApp"));
import LayoutTranslation from "../../public/locales/layout.json";

function Layout({ children }) {
  return (
    <>
      <DynamicMenu translation={LayoutTranslation?.menu} />
      {children}
      <DynamicBackToTop />
      <DynamicWhatsapp />
      <DynamicFooter translation={LayoutTranslation} />
    </>
  );
}

export default Layout;
