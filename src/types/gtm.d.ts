declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __gtm_loaded?: boolean;
  }
}
export {};
