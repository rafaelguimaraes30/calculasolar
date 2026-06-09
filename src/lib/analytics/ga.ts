export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export function isGaConfigured(): boolean {
  return GA_MEASUREMENT_ID.length > 0;
}

export function initGoogleAnalytics(): void {
  if (!isGaConfigured()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("js", new Date());
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
}

export function trackPageView(pagePath: string): void {
  if (!isGaConfigured()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: pagePath,
  });
}

export function buildPagePath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}
