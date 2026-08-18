/**
 * Resolves the API base URL for both web and native.
 *
 * Web: `web.output: "static"` bakes `process.env.EXPO_PUBLIC_API_URL` into the
 * bundle at build time, which would pin one Docker image to one environment. To
 * let a single image serve Staging and Production, the nginx container's
 * entrypoint regenerates `/env.js` from its runtime `EXPO_PUBLIC_API_URL` (see
 * docker/40-runtime-env.sh) and sets `window.__APP_CONFIG__.API_URL`. That
 * `/env.js` loads before the app bundle, so the runtime value wins here.
 *
 * Native (and local dev / the static pre-render pass): there is no nginx
 * container, so we fall back to the value baked in via `EXPO_PUBLIC_API_URL`.
 */
declare global {
  interface Window {
    __APP_CONFIG__?: { API_URL?: string };
  }
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.__APP_CONFIG__?.API_URL) {
    return window.__APP_CONFIG__.API_URL;
  }
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (!fromEnv) {
    throw new Error(
      "API URL is not configured (window.__APP_CONFIG__.API_URL or EXPO_PUBLIC_API_URL)",
    );
  }
  return fromEnv;
}
