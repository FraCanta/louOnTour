import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACCESSIBILITY_PANEL_EVENT,
  getStoredAccessibilityPreferences,
  saveAccessibilityPreferences,
  resetAccessibilityPreferences,
  applyAccessibilityPreferences,
} from "../../utils/accessibilityPreferences";

const COPY = {
  it: {
    button: "Apri strumenti di accessibilita",
    title: "Accessibilita",
    body:
      "Regola la visualizzazione del sito in base alle tue preferenze. Le scelte restano salvate su questo dispositivo.",
    close: "Chiudi",
    reset: "Ripristina",
    largeText: "Testo piu grande",
    highContrast: "Contrasto elevato",
    highlightLinks: "Link sottolineati",
    readableFont: "Font piu leggibile",
    reduceMotion: "Riduci animazioni",
    pageLink: "Informazioni accessibilita",
  },
  en: {
    button: "Open accessibility tools",
    title: "Accessibility",
    body:
      "Adjust the website display to match your preferences. Choices are saved on this device.",
    close: "Close",
    reset: "Reset",
    largeText: "Larger text",
    highContrast: "High contrast",
    highlightLinks: "Underlined links",
    readableFont: "More readable font",
    reduceMotion: "Reduce motion",
    pageLink: "Accessibility information",
  },
};

const OPTIONS = [
  { key: "largeText", icon: "hugeicons:text-font" },
  { key: "highContrast", icon: "hugeicons:contrast" },
  { key: "highlightLinks", icon: "hugeicons:link-02" },
  { key: "readableFont", icon: "hugeicons:font-02" },
  { key: "reduceMotion", icon: "hugeicons:play-disable" },
];

export default function AccessibilityWidget() {
  const { locale } = useRouter();
  const content = COPY[locale] || COPY.it;
  const closeButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState(() =>
    getStoredAccessibilityPreferences()
  );

  const pageHref = useMemo(
    () => (locale === "en" ? "/en/accessibilita" : "/accessibilita"),
    [locale]
  );

  useEffect(() => {
    const stored = getStoredAccessibilityPreferences();
    setPreferences(stored);
    applyAccessibilityPreferences(stored);

    const openPanel = () => setIsOpen(true);
    window.addEventListener(ACCESSIBILITY_PANEL_EVENT, openPanel);

    return () => {
      window.removeEventListener(ACCESSIBILITY_PANEL_EVENT, openPanel);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function updatePreference(key, value) {
    const nextPreferences = { ...preferences, [key]: value };
    setPreferences(nextPreferences);
    saveAccessibilityPreferences(nextPreferences);
  }

  function resetPreferences() {
    resetAccessibilityPreferences();
    setPreferences(getStoredAccessibilityPreferences());
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[9997] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#232f37]/15 bg-[#232f37] text-white shadow-[0_16px_40px_rgba(35,47,55,0.2)] transition hover:bg-[#c9573c] sm:right-5"
        aria-label={content.button}
        title={content.button}
      >
        <Icon icon="mdi:accessibility" width="26" height="26" />
      </button>

      {isOpen ? (
        <section
          className="fixed bottom-36 right-3 z-[9998] w-[min(23rem,calc(100vw-1.5rem))] max-h-[calc(100vh-10rem)] overflow-y-auto rounded-md border border-[#c9573c]/20 bg-white p-4 text-[#232f37] shadow-[0_18px_55px_rgba(35,47,55,0.18)] sm:right-5 sm:bottom-36 sm:p-5"
          role="dialog"
          aria-labelledby="accessibility-widget-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="accessibility-widget-title"
                className="text-lg font-semibold text-[#232f37]"
              >
                {content.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#526066]">
                {content.body}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#c9573c]/15 text-[#c9573c] transition hover:bg-[#fff4ef]"
              aria-label={content.close}
              title={content.close}
            >
              <Icon icon="hugeicons:cancel-01" width="18" height="18" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {OPTIONS.map((option) => (
              <AccessibilityToggle
                key={option.key}
                icon={option.icon}
                label={content[option.key]}
                checked={preferences[option.key]}
                onChange={(checked) => updatePreference(option.key, checked)}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-[#c9573c]/10 pt-4 sm:flex-row sm:justify-between">
            <a
              href={pageHref}
              className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#c9573c]/20 px-3 py-2 text-sm font-semibold text-[#c9573c] hover:bg-[#fff4ef]"
            >
              <Icon icon="hugeicons:information-circle" width="16" height="16" />
              {content.pageLink}
            </a>
            <button
              type="button"
              onClick={resetPreferences}
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#232f37] px-3 py-2 text-sm font-semibold text-white hover:bg-[#c9573c]"
            >
              <Icon icon="hugeicons:reload" width="16" height="16" />
              {content.reset}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

function AccessibilityToggle({ icon, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-[#c9573c]/10 bg-[#fffaf7] p-3">
      <span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-[#232f37]">
        <Icon icon={icon} width="18" height="18" className="flex-shrink-0 text-[#c9573c]" />
        <span>{label}</span>
      </span>
      <span className="relative inline-flex flex-shrink-0 items-center">
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-[#d8c8bd] transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#232f37] peer-checked:bg-[#c9573c]" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
