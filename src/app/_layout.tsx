import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/query-client";
import { selectHasHydrated, useAuthStore } from "@/store/auth-store";

// Keep the native splash up until fonts are ready.
SplashScreen.preventAutoHideAsync();

console.log("version: 1.0.1");

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    "Biennale-SemiBold": require("@/assets/fonts/biennale-semibold.otf"),
    "Biennale-Regular": require("@/assets/fonts/biennale-regular.otf"),
    "LibreFranklin-Regular": require("@/assets/fonts/librefranklin-regular.ttf"),
    "LibreFranklin-Bold": require("@/assets/fonts/librefranklin-bold.ttf"),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {/* Sets the browser tab title on web. Placed here (not in RootNavigator,
          which renders null until hydrated) so it also applies during the static
          web export. No route overrides it, so "Healthily" is the title app-wide. */}
      <Head>
        <title>Healthily</title>
      </Head>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootNavigator fontsReady={fontsLoaded || !!fontError} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const hasHydrated = useAuthStore(selectHasHydrated);

  // Rehydrate the persisted auth store on the client. `web.output: "static"`
  // prerenders in Node (no localStorage), so hydration is skipped at store
  // creation and triggered here instead — effects run only in the browser.
  // `onRehydrateStorage` flips `hasHydrated` once it settles (even on error).
  useEffect(() => {
    if (typeof window !== "undefined") void useAuthStore.persist.rehydrate();
  }, []);

  // Wait for fonts AND store rehydration before the first frame, so a startup CTA
  // never reads a stale (empty) saved login. Keep the native splash up until both.
  const ready = fontsReady && hasHydrated;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Render nothing while we wait so the native splash covers the first frame.
  if (!ready) return null;

  // Both groups are always mounted so every user lands on `/` (the (app) index)
  // regardless of auth state. Access to the gated screens (assessment/chat) is
  // guarded inside (app)/_layout; the home buttons route logged-out users to login.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
