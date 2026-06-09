export const GA_MEASUREMENT_ID = "G-8GNZ4NKKCC";

export function initGoogleAnalytics(): void {
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
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: pagePath,
  });
}

export function buildPagePath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}
