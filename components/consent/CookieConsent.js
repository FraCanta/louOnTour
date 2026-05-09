import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_PREFERENCES_EVENT,
  getStoredCookieConsent,
  saveCookieConsent,
} from "../../utils/cookieConsent";

const GA_ID = "G-FJ2J5B3EPX";

const COPY = {
  it: {
    title: "Preferenze privacy",
    body:
      "Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso possiamo usare anche strumenti di statistica e contenuti di terze parti.",
    customize: "Personalizza",
    reject: "Rifiuta",
    accept: "Accetta tutto",
    save: "Salva scelte",
    close: "Chiudi e rifiuta",
    policy: "Cookie Policy",
    privacy: "Privacy Policy",
    necessaryTitle: "Necessari",
    necessaryText: "Servono per sicurezza, preferenze e funzionamento del sito. Sono sempre attivi.",
    analyticsTitle: "Statistiche",
    analyticsText: "Google Analytics ci aiuta a capire quali pagine funzionano meglio.",
    marketingTitle: "Contenuti esterni",
    marketingText: "Servizi come Elfsight, Instagram o contenuti incorporati possono usare propri tracciamenti.",
    alwaysOn: "Sempre attivi",
    floatingLabel: "Preferenze cookie",
  },
  en: {
    title: "Privacy preferences",
    body:
      "We use technical cookies required for the website to work. With your consent, we can also use analytics tools and third-party content.",
    customize: "Customize",
    reject: "Reject",
    accept: "Accept all",
    save: "Save choices",
    close: "Close and reject",
    policy: "Cookie Policy",
    privacy: "Privacy Policy",
    necessaryTitle: "Necessary",
    necessaryText: "Used for security, preferences and website operation. They are always active.",
    analyticsTitle: "Analytics",
    analyticsText: "Google Analytics helps us understand which pages work best.",
    marketingTitle: "External content",
    marketingText: "Services such as Elfsight, Instagram or embedded content may use their own tracking.",
    alwaysOn: "Always active",
    floatingLabel: "Cookie preferences",
  },
};

export function ConsentScripts() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const updateConsent = (event) => {
      setConsent(event?.detail || getStoredCookieConsent());
    };

    updateConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, updateConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, updateConsent);
    };
  }, []);

  if (!consent?.analytics) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

export default function CookieConsent() {
  const { locale } = useRouter();
  const content = COPY[locale] || COPY.it;
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const privacyHref = useMemo(() => (locale === "en" ? "/en/privacy-policy" : "/privacy-policy"), [locale]);
  const cookieHref = useMemo(() => (locale === "en" ? "/en/cookie-policy" : "/cookie-policy"), [locale]);

  useEffect(() => {
    const stored = getStoredCookieConsent();

    if (stored) {
      setPreferences({ necessary: true, analytics: Boolean(stored.analytics), marketing: Boolean(stored.marketing) });
      return;
    }

    setIsOpen(true);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      const stored = getStoredCookieConsent();
      setPreferences({
        necessary: true,
        analytics: Boolean(stored?.analytics),
        marketing: Boolean(stored?.marketing),
      });
      setShowDetails(true);
      setIsOpen(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  function persist(nextPreferences) {
    saveCookieConsent(nextPreferences);
    setPreferences({ necessary: true, ...nextPreferences });
    setIsOpen(false);
    setShowDetails(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const stored = getStoredCookieConsent();
          setPreferences({
            necessary: true,
            analytics: Boolean(stored?.analytics),
            marketing: Boolean(stored?.marketing),
          });
          setShowDetails(true);
          setIsOpen(true);
        }}
        className={`cookie-consent-trigger fixed bottom-5 right-4 z-[1000000] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c9573c]/25 bg-white text-[#c9573c] shadow-[0_16px_40px_rgba(35,47,55,0.18)] transition hover:bg-[#fff4ef] sm:right-5 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={content.floatingLabel}
        title={content.floatingLabel}
      >
        <Icon icon="hugeicons:cookie" width="24" height="24" />
      </button>

      {isOpen ? (
        <div
          className="cookie-consent-overlay fixed inset-x-0 bottom-0 z-[1000000] px-3 pt-3 sm:px-5 sm:pb-5"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <section
            className="cookie-consent-panel mx-auto max-h-[calc(100svh-1.5rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-md border border-[#c9573c]/20 bg-white p-3 text-[#232f37] shadow-[0_18px_60px_rgba(35,47,55,0.18)] sm:max-h-[calc(100svh-2.5rem)] sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
          >
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h2 id="cookie-consent-title" className="text-lg font-semibold text-[#c9573c]">
                  {content.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#5f6d72]">{content.body}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <Link className="font-semibold text-[#c9573c] underline underline-offset-4" href={cookieHref}>
                    {content.policy}
                  </Link>
                  <Link className="font-semibold text-[#c9573c] underline underline-offset-4" href={privacyHref}>
                    {content.privacy}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={() => persist({ analytics: true, marketing: true })}
                  className="rounded-[2px] bg-[#c9573c] px-4 py-2.5 text-sm font-semibold text-white sm:py-3"
                >
                  {content.accept}
                </button>
                <button
                  type="button"
                  onClick={() => persist({ analytics: false, marketing: false })}
                  className="rounded-[2px] border border-[#c9573c]/25 px-4 py-2.5 text-sm font-semibold text-[#c9573c] sm:py-3"
                >
                  {content.reject}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails((current) => !current)}
                  className="rounded-[2px] border border-[#d8c8bd] px-4 py-2.5 text-sm font-semibold text-[#435257] sm:py-3"
                >
                  {content.customize}
                </button>
              </div>
            </div>

            {showDetails ? (
              <div className="cookie-consent-details mt-4 border-t border-[#c9573c]/10 pt-4">
                <div className="cookie-consent-options grid max-h-[28svh] gap-2.5 overflow-y-auto overscroll-contain pr-1 sm:max-h-none sm:gap-3 sm:overflow-visible sm:pr-0 md:grid-cols-3">
                  <PreferenceRow
                    title={content.necessaryTitle}
                    text={content.necessaryText}
                    aside={content.alwaysOn}
                  />
                  <PreferenceRow
                    title={content.analyticsTitle}
                    text={content.analyticsText}
                    checked={preferences.analytics}
                    onChange={(checked) => setPreferences((current) => ({ ...current, analytics: checked }))}
                  />
                  <PreferenceRow
                    title={content.marketingTitle}
                    text={content.marketingText}
                    checked={preferences.marketing}
                    onChange={(checked) => setPreferences((current) => ({ ...current, marketing: checked }))}
                  />
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => persist({ analytics: false, marketing: false })}
                    className="rounded-[2px] border border-[#c9573c]/25 px-4 py-2.5 text-sm font-semibold text-[#c9573c] sm:py-3"
                  >
                    {content.close}
                  </button>
                  <button
                    type="button"
                    onClick={() => persist(preferences)}
                    className="rounded-[2px] bg-[#232f37] px-4 py-2.5 text-sm font-semibold text-white sm:py-3"
                  >
                    {content.save}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

function PreferenceRow({ title, text, aside, checked, onChange }) {
  return (
    <div className="rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#232f37]">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#6d7b80]">{text}</p>
        </div>
        {aside ? (
          <span className="whitespace-nowrap text-xs font-semibold text-[#c9573c]">{aside}</span>
        ) : (
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={Boolean(checked)}
              onChange={(event) => onChange(event.target.checked)}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-[#d8c8bd] transition peer-checked:bg-[#c9573c]" />
            <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        )}
      </div>
    </div>
  );
}
