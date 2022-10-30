import Menu from "./menu";
import Menu_mobile from "./menu_mobile";

function Layout({ children }) {
  return (
    <>
      <Menu_mobile />
      <Menu />
      {children}
    </>
  );
}

export default Layout;
