// Runtime web config. In production this file is overwritten at container start
// by /docker-entrypoint.d/40-runtime-env.sh with the environment's API_URL.
// This committed version is the dev/build fallback: it defines nothing, so the
// app falls back to the baked EXPO_PUBLIC_API_URL (see src/lib/config.ts). It
// exists so `expo start` and the static export always have a /env.js to serve.
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
