export const CONSENT_STORAGE_KEY = "calculasolar_cookie_consent";
export const CONSENT_CHANGE_EVENT = "calculasolar-consent-change";

export type ConsentStatus = "accepted" | "rejected";

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function notifyConsentChange(): void {
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

export function setStoredConsent(status: ConsentStatus): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, status);
  notifyConsentChange();
}

export function clearStoredConsent(): void {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  notifyConsentChange();
}
