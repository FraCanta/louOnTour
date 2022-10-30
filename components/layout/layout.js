import Menu from "./menu";
import Menu_mobile from "./menu_mobile";
import Hero from "./hero";
import Mission from "../sectionOne/mission";
import Map from "../sectionTwo/map";

function Layout() {
  return (
    <>
      <Menu_mobile />
      <Menu />
      <Hero />
      <Mission />
      <Map />
    </>
  );
}

export default Layout;
