"use client";

import { Cookie } from "lucide-react";

interface CookieConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieConsentBanner({ onAccept, onReject }: CookieConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-800/10 bg-white/95 p-4 shadow-[0_-8px_32px_rgba(10,22,40,0.12)] backdrop-blur-md sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-solar-500 to-solar-400">
            <Cookie className="h-5 w-5 text-navy-900" />
          </span>
          <div>
            <p id="cookie-consent-title" className="font-bold text-navy-900">
              Cookies e privacidade
            </p>
            <p id="cookie-consent-description" className="mt-1 text-sm leading-relaxed text-navy-700/70">
              Utilizamos cookies de análise para entender como o site é utilizado e melhorar sua
              experiência. Você pode aceitar ou recusar o uso do Google Analytics.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onReject}
            className="rounded-full border border-navy-800/15 px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-800/25 hover:bg-navy-800/5"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-5 py-2.5 text-sm font-bold text-navy-900 transition-all hover:scale-105"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
