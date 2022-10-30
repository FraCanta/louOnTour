import React from "react";
import Mission from "../sectionOne/mission";
import Map from "../sectionTwo/map";
import Hero from "./hero";
import Menu from "./menu";
import Menu_mobile from "./menu_mobile";

const Layout = () => {
  return (
    <>
      <Menu_mobile />
      <Menu />
      <Hero />
      <Mission />
      <Map />
    </>
  );
};

export default Layout;
