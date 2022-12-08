import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicMenu = dynamic(() => import("./menu"));
const DynamicMenu_mobile = dynamic(() => import("./menu_mobile"));
const DynamicBackToTop = dynamic(() => import("./backToTop"));
const DynamicWhatsapp = dynamic(() => import("./whatsApp"));
import LayoutTranslation from "../../public/locales/layout.json";

function Layout({ children }) {
  return (
    <>
      <DynamicMenu_mobile translation={LayoutTranslation?.menu} />
      <DynamicMenu translation={LayoutTranslation?.menu} />
      {children}
      <DynamicBackToTop />
      <DynamicWhatsapp />
      <DynamicFooter translation={LayoutTranslation?.footer} />
    </>
  );
}

export default Layout;
