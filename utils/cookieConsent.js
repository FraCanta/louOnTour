export const COOKIE_CONSENT_KEY = "lou-cookie-consent-v1";
export const COOKIE_CONSENT_EVENT = "lou-cookie-consent-updated";
export const COOKIE_PREFERENCES_EVENT = "lou-cookie-preferences-open";

export function getStoredCookieConsent() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences) {
  if (typeof window === "undefined") {
    return;
  }

  const value = {
    necessary: true,
    analytics: Boolean(preferences?.analytics),
    marketing: Boolean(preferences?.marketing),
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT));
  }
}
