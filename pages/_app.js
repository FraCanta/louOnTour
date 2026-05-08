import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/aboutMe.css";
import "../styles/insta.css";
import "../styles/banner.css";
import "../styles/gallery3d.css";
import "../styles/form.css";
import "../styles/testimonials.css";
import "../styles/blog.css";
import "../styles/wordpress.css";
import "../styles/swiper_bullet.css";

import dynamic from "next/dynamic";
import AOS from "aos";
import { useEffect } from "react";
import { useRouter } from "next/router";
import CookieConsent, { ConsentScripts } from "../components/consent/CookieConsent";
import AccessibilityWidget from "../components/accessibility/AccessibilityWidget";
const DynamicLayout = dynamic(() => import("../components/layout/layout"));

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const skipLabel = router.locale === "en" ? "Skip to content" : "Salta al contenuto";

  useEffect(() => {
    // here you can add your aos options
    AOS.init({
      offset: 200,
      duration: 500,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <>
      {isAdminRoute ? (
        <Component {...pageProps} />
      ) : (
        <>
          <a href="#main-content" className="skip-link">
            {skipLabel}
          </a>
          <DynamicLayout>
            <div id="main-content" tabIndex="-1">
              <Component {...pageProps} />
            </div>
          </DynamicLayout>
        </>
      )}
      {!isAdminRoute ? <AccessibilityWidget /> : null}
      {!isAdminRoute ? <CookieConsent /> : null}
      <ConsentScripts />
    </>
  );
}

export default MyApp;
