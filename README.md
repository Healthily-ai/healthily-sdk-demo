# Welcome to the healthily-sdk-demo 👋

## Get started

1. Install dependencies

   ```bash
   pnpm i
   ```

2. Start the app

   ```bash
   pnpm expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### How it works

`expo export` normally inlines `EXPO_PUBLIC_*` values into the JS bundle at build time, which would pin one image to one environment. To avoid that, the web build ships a runtime-config shim:

- `src/app/+html.tsx` adds a blocking `<script src="/env.js">` to every page, loaded **before** the app bundle.
- `docker/40-runtime-env.sh` (auto-run by nginx's `/docker-entrypoint.d/` on startup) regenerates `/env.js` from the container's `EXPO_PUBLIC_API_URL`, setting `window.__APP_CONFIG__.API_URL`.
- `getApiBaseUrl()` in `src/lib/config.ts` reads `window.__APP_CONFIG__.API_URL` first, falling back to the build-time-baked `EXPO_PUBLIC_API_URL`.

Change the environment by changing one runtime env var and restarting the container — **no rebuild**.

### Mobile (iOS / Android)

Native builds have no nginx container, so they keep the standard Expo behavior: `EXPO_PUBLIC_API_URL` is baked in at **build time** per EAS profile (see `eas.json`). The runtime shim above only affects web.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
