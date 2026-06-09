"use client";

import { useConsent } from "./AnalyticsProvider";

export function CookiePreferencesLink() {
  const { reopenConsentBanner } = useConsent();

  return (
    <button
      type="button"
      onClick={reopenConsentBanner}
      className="text-sm text-navy-700/65 transition-colors hover:text-solar-600"
    >
      Preferências de cookies
    </button>
  );
}
