import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicMenu = dynamic(() => import("./menu"));
const DynamicMenu_mobile = dynamic(() => import("./menu_mobile"));
const DynamicBackToTop = dynamic(() => import("./backToTop"));
const DynamicWhatsapp = dynamic(() => import("./whatsApp"));

function Layout({ children }) {
  return (
    <>
      <DynamicMenu_mobile />
      <DynamicMenu />
      {children}
      <DynamicBackToTop />
      <DynamicWhatsapp />
      <DynamicFooter />
    </>
  );
}

export default Layout;
