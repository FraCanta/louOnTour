import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"));
const DynamicMenu = dynamic(() => import("./menu"));
import LayoutTranslation from "../../public/locales/layout.json";
import LenisScroll from "../LenisScroll/LenisScroll";

function Layout({ children }) {
  return (
    <>
      <LenisScroll />
      <DynamicMenu translation={LayoutTranslation?.menu} />
      {children}
      <DynamicFooter translation={LayoutTranslation} />
    </>
  );
}

export default Layout;
