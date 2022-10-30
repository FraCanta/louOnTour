import Menu from "./menu";
import Menu_mobile from "./menu_mobile";
import Hero from "./hero";
import Mission from "../sectionOne/mission";
import Map from "../sectionTwo/map";

function Layout({ children }) {
  return (
    <>
      <Menu_mobile />
      <Menu />
      {children}
      {/* <Hero />
      <Mission />
      <Map /> */}
    </>
  );
}

export default Layout;
