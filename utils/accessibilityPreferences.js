export const ACCESSIBILITY_PREFERENCES_KEY = "lou-accessibility-preferences-v1";
export const ACCESSIBILITY_PREFERENCES_EVENT = "lou-accessibility-preferences-updated";
export const ACCESSIBILITY_PANEL_EVENT = "lou-accessibility-panel-open";

export const DEFAULT_ACCESSIBILITY_PREFERENCES = {
  largeText: false,
  lineHeight: false,
  letterSpacing: false,
  centerAlign: false,
  boldText: false,
  highContrast: false,
  lightContrast: false,
  monochrome: false,
  highlightLinks: false,
  readableFont: false,
  largeCursor: false,
  hideImages: false,
  reduceMotion: false,
};

const CLASS_MAP = {
  largeText: "lou-a11y-large-text",
  lineHeight: "lou-a11y-line-height",
  letterSpacing: "lou-a11y-letter-spacing",
  centerAlign: "lou-a11y-center-align",
  boldText: "lou-a11y-bold-text",
  highContrast: "lou-a11y-contrast",
  lightContrast: "lou-a11y-light-contrast",
  monochrome: "lou-a11y-monochrome",
  highlightLinks: "lou-a11y-highlight-links",
  readableFont: "lou-a11y-readable-font",
  largeCursor: "lou-a11y-large-cursor",
  hideImages: "lou-a11y-hide-images",
  reduceMotion: "lou-a11y-reduce-motion",
};

export function normalizeAccessibilityPreferences(preferences = {}) {
  return Object.keys(DEFAULT_ACCESSIBILITY_PREFERENCES).reduce((result, key) => {
    result[key] = Boolean(preferences[key]);
    return result;
  }, {});
}

export function getStoredAccessibilityPreferences() {
  if (typeof window === "undefined") {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(ACCESSIBILITY_PREFERENCES_KEY);
    if (!raw) {
      return DEFAULT_ACCESSIBILITY_PREFERENCES;
    }

    return normalizeAccessibilityPreferences(JSON.parse(raw));
  } catch (error) {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }
}

export function applyAccessibilityPreferences(preferences = {}) {
  if (typeof document === "undefined") {
    return;
  }

  const normalized = normalizeAccessibilityPreferences(preferences);
  Object.entries(CLASS_MAP).forEach(([key, className]) => {
    document.documentElement.classList.toggle(className, normalized[key]);
  });
}

export function saveAccessibilityPreferences(preferences = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeAccessibilityPreferences(preferences);
  window.localStorage.setItem(
    ACCESSIBILITY_PREFERENCES_KEY,
    JSON.stringify(normalized)
  );
  applyAccessibilityPreferences(normalized);
  window.dispatchEvent(
    new CustomEvent(ACCESSIBILITY_PREFERENCES_EVENT, { detail: normalized })
  );
}

export function resetAccessibilityPreferences() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESSIBILITY_PREFERENCES_KEY);
  applyAccessibilityPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);
  window.dispatchEvent(
    new CustomEvent(ACCESSIBILITY_PREFERENCES_EVENT, {
      detail: DEFAULT_ACCESSIBILITY_PREFERENCES,
    })
  );
}

export function openAccessibilityPreferences() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(ACCESSIBILITY_PANEL_EVENT));
}
