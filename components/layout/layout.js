import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"), { ssr: false });
const DynamicMenu = dynamic(() => import("./menu"), { ssr: false });
import LayoutTranslation from "../../public/locales/layout.json";
const LenisScroll = dynamic(() => import("../LenisScroll/LenisScroll"), {
  ssr: false,
});
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
