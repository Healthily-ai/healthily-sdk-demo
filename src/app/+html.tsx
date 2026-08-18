import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

/**
 * Root HTML wrapper for the static web export. This component only ever runs in
 * Node.js during `expo export --platform web`; it does not affect native.
 *
 * The synchronous `<script src="/env.js">` is what makes a single Docker image
 * work on Staging and Production: the nginx container regenerates `/env.js` from
 * its runtime `EXPO_PUBLIC_API_URL` (docker/40-runtime-env.sh), and because this
 * is a render-blocking script in <head>, it runs before Expo's deferred app
 * bundle — so `window.__APP_CONFIG__.API_URL` is set before any app code reads it
 * (see src/lib/config.ts).
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Runtime config, regenerated per-environment by the container entrypoint. */}
        <script src="/env.js" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
