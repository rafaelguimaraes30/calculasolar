type GtagCommand = "config" | "event" | "js" | "consent" | "set";

interface Window {
  dataLayer?: unknown[];
  gtag?: (
    command: GtagCommand,
    target: string | Date | Record<string, string>,
    params?: Record<string, unknown>,
  ) => void;
}
