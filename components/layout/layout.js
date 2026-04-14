import dynamic from "next/dynamic";
const DynamicFooter = dynamic(() => import("./footer"), { ssr: false });
const DynamicMenu = dynamic(() => import("./menu"), { ssr: false });
import LayoutTranslation from "../../public/locales/layout.json";
const ElfsightWidget = dynamic(() => import("./ElfsightWidget"), {
  ssr: false,
});
const LenisScroll = dynamic(() => import("../LenisScroll/LenisScroll"), {
  ssr: false,
});
function Layout({ children }) {
  return (
    <>
      <LenisScroll />
      <DynamicMenu translation={LayoutTranslation?.menu} />
      {children}
      <ElfsightWidget />
      <DynamicFooter translation={LayoutTranslation} />
    </>
  );
}

export default Layout;
