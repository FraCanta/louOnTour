import React from "react";
import Hero from "./hero";
import Menu from "./menu";
import Menu_mobile from "./menu_mobile";

const Layout = () => {
  return (
    <>
      <Menu_mobile />
      <Menu />
      <Hero />
    </>
  );
};

export default Layout;
