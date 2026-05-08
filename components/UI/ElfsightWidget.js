import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_EVENT,
  getStoredCookieConsent,
  openCookiePreferences,
} from "../../utils/cookieConsent";

const ElfsightWidget = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateConsent = (event) => {
      const consent = event?.detail || getStoredCookieConsent();
      setHasMarketingConsent(Boolean(consent?.marketing));
    };

    updateConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, updateConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, updateConsent);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!hasMarketingConsent) {
    return (
      <section className="mx-auto my-12 w-11/12 max-w-4xl rounded-md border border-[#c9573c]/15 bg-[#fffaf7] p-5 text-center">
        <p className="text-sm leading-relaxed text-[#5f6d72]">
          Per vedere le recensioni e i contenuti esterni, abilita i cookie per
          contenuti di terze parti.
        </p>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="mt-3 rounded-[2px] bg-[#c9573c] px-4 py-2 text-sm font-semibold text-white"
        >
          Gestisci preferenze
        </button>
      </section>
    );
  }

  return (
    <>
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />
      <div
        className="elfsight-app-3556d60c-9ec1-4325-8318-b25c82d7ac2a !overflow-hidden"
        data-elfsight-app-lazy
      ></div>
    </>
  );
};

export default ElfsightWidget;
