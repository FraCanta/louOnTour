import Footer from "./footer";
import Menu from "./menu";
import Menu_mobile from "./menu_mobile";
import Banner from "../sectionFive/banner";

function Layout({ children }) {
  return (
    <>
      <Menu_mobile />
      <Menu />
      {children}
      <Banner />
      <Footer />
    </>
  );
}

export default Layout;
