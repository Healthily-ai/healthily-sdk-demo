import { Stack } from 'expo-router';

import { selectIsAuthenticated, useAuthStore } from '@/store/auth-store';

export default function AppLayout() {
  const isLoggedIn = useAuthStore(selectIsAuthenticated);

  // `index` (home) is public so everyone can land on `/`. The assessment and
  // chat screens require an authenticated SDK session — guarding them here is a
  // backstop for deep links / direct URLs; the home buttons send logged-out
  // users to /login before they ever reach these routes.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="assessment" />
        <Stack.Screen name="chat" />
      </Stack.Protected>
    </Stack>
  );
}
