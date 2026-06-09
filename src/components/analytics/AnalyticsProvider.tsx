"use client";

import {
  clearStoredConsent,
  getStoredConsent,
  setStoredConsent,
  subscribeConsent,
  type ConsentStatus,
} from "@/lib/analytics/consent";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/ga";
import Script from "next/script";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CookieConsentBanner } from "./CookieConsentBanner";
import { GoogleAnalyticsPageView } from "./GoogleAnalyticsPageView";

interface ConsentContextValue {
  consent: ConsentStatus | null;
  reopenConsentBanner: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within AnalyticsProvider");
  }
  return context;
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getStoredConsent,
    () => null,
  );
  const isClient = useIsClient();
  const [gaReady, setGaReady] = useState(false);

  const handleAccept = useCallback(() => {
    setStoredConsent("accepted");
  }, []);

  const handleReject = useCallback(() => {
    setStoredConsent("rejected");
    setGaReady(false);
  }, []);

  const reopenConsentBanner = useCallback(() => {
    clearStoredConsent();
    setGaReady(false);
  }, []);

  const showBanner = isClient && consent === null;
  const analyticsEnabled = consent === "accepted";

  return (
    <ConsentContext.Provider value={{ consent, reopenConsentBanner }}>
      {showBanner && (
        <CookieConsentBanner onAccept={handleAccept} onReject={handleReject} />
      )}

      {analyticsEnabled && (
        <>
          <Script
            id="google-analytics-consent-default"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500
              });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
            onReady={() => setGaReady(true)}
          />
        </>
      )}

      {analyticsEnabled && (
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView
            enabled={analyticsEnabled}
            gaReady={gaReady}
          />
        </Suspense>
      )}

      {children}
    </ConsentContext.Provider>
  );
}
