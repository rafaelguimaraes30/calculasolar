"use client";

import {
  buildPagePath,
  initGoogleAnalytics,
  trackPageView,
} from "@/lib/analytics/ga";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface GoogleAnalyticsPageViewProps {
  enabled: boolean;
  gaReady: boolean;
}

export function GoogleAnalyticsPageView({
  enabled,
  gaReady,
}: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || !gaReady) return;

    if (!hasInitialized.current) {
      initGoogleAnalytics();
      const pagePath = buildPagePath(pathname, searchParams.toString());
      lastTrackedPath.current = pagePath;
      trackPageView(pagePath);
      hasInitialized.current = true;
      return;
    }

    const pagePath = buildPagePath(pathname, searchParams.toString());
    if (lastTrackedPath.current === pagePath) return;

    lastTrackedPath.current = pagePath;
    trackPageView(pagePath);
  }, [enabled, gaReady, pathname, searchParams]);

  return null;
}
