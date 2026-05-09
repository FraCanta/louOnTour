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
    lineHeight: "Altezza della linea",
    letterSpacing: "Spaziatura lettere",
    centerAlign: "Allinea al centro",
    boldText: "Testo piu spesso",
    highContrast: "Contrasto elevato",
    lightContrast: "Contrasto chiaro",
    monochrome: "Monocromatico",
    highlightLinks: "Link sottolineati",
    readableFont: "Font piu leggibile",
    largeCursor: "Cursore grande",
    hideImages: "Nascondi immagini",
    reduceMotion: "Riduci animazioni",
    contentGroup: "Contenuto",
    colorGroup: "Colore",
    orientationGroup: "Orientamento",
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
    lineHeight: "Line height",
    letterSpacing: "Letter spacing",
    centerAlign: "Center align",
    boldText: "Bolder text",
    highContrast: "High contrast",
    lightContrast: "Light contrast",
    monochrome: "Monochrome",
    highlightLinks: "Underlined links",
    readableFont: "More readable font",
    largeCursor: "Large cursor",
    hideImages: "Hide images",
    reduceMotion: "Reduce motion",
    contentGroup: "Content",
    colorGroup: "Color",
    orientationGroup: "Orientation",
    pageLink: "Accessibility information",
  },
};

const OPTION_GROUPS = [
  {
    titleKey: "contentGroup",
    options: [
      { key: "largeText", icon: "hugeicons:text-font" },
      { key: "lineHeight", icon: "mdi:format-line-spacing" },
      { key: "letterSpacing", icon: "mdi:format-letter-spacing" },
      { key: "centerAlign", icon: "mdi:format-align-center" },
      { key: "boldText", icon: "mdi:format-bold" },
      { key: "readableFont", icon: "mdi:format-font" },
    ],
  },
  {
    titleKey: "colorGroup",
    options: [
      { key: "lightContrast", icon: "mdi:white-balance-sunny" },
      { key: "highContrast", icon: "mdi:theme-light-dark" },
      { key: "monochrome", icon: "mdi:circle-half-full" },
    ],
  },
  {
    titleKey: "orientationGroup",
    options: [
      { key: "largeCursor", icon: "mdi:cursor-default-click-outline" },
      { key: "highlightLinks", icon: "hugeicons:link-02" },
      { key: "hideImages", icon: "mdi:image-off-outline" },
      { key: "reduceMotion", icon: "mdi:pause-circle-outline" },
    ],
  },
];

export default function AccessibilityWidget() {
  const { locale } = useRouter();
  const content = COPY[locale] || COPY.it;
  const closeButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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

    const openPanel = () => openPanelDrawer();
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
        closePanelDrawer();
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

  function openPanelDrawer() {
    setIsClosing(false);
    setIsOpen(true);
  }

  function closePanelDrawer() {
    setIsClosing(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPanelDrawer}
        className={`accessibility-widget-trigger fixed bottom-5 left-4 z-[1000000] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#232f37]/15 bg-[#232f37] text-white shadow-[0_16px_40px_rgba(35,47,55,0.2)] transition hover:bg-[#c9573c] sm:left-5 ${
          isOpen || isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={content.button}
        title={content.button}
      >
        <Icon icon="mdi:accessibility" width="26" height="26" />
      </button>

      {isOpen ? (
        <div
          className={`accessibility-widget-backdrop fixed inset-0 z-[1000000] overflow-hidden bg-[#232f37]/30 ${
            isClosing ? "accessibility-widget-backdrop-closing" : ""
          }`}
          onAnimationEnd={() => {
            if (isClosing) {
              setIsOpen(false);
              setIsClosing(false);
            }
          }}
        >
          <section
            className={`accessibility-widget-panel h-[100svh] max-h-[100svh] w-full overflow-y-auto overscroll-contain bg-white p-4 text-[#232f37] shadow-[18px_0_55px_rgba(35,47,55,0.18)] sm:max-w-[34rem] sm:p-6 ${
              isClosing ? "accessibility-widget-panel-closing" : ""
            }`}
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
            role="dialog"
            aria-modal="true"
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
                onClick={closePanelDrawer}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#c9573c]/15 text-[#c9573c] transition hover:bg-[#fff4ef]"
                aria-label={content.close}
                title={content.close}
              >
                <Icon icon="hugeicons:cancel-01" width="19" height="19" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {OPTION_GROUPS.map((group) => (
                <div key={group.titleKey}>
                  <h3 className="mb-2 text-sm font-semibold text-[#c9573c]">
                    {content[group.titleKey]}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.options.map((option) => (
                      <AccessibilityToggle
                        key={option.key}
                        icon={option.icon}
                        label={content[option.key]}
                        checked={preferences[option.key]}
                        onChange={(checked) => updatePreference(option.key, checked)}
                      />
                    ))}
                  </div>
                </div>
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
        </div>
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
