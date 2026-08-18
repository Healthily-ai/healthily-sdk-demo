import { AssessmentProvider, ThemeProvider } from '@yourmd/yourmd-react-native';
import { Redirect } from 'expo-router';
import { useMemo, type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { buildAssessmentConfig, sdkTheme } from '@/lib/yourmd';
import { useAuthStore } from '@/store/auth-store';

/**
 * Wraps a Healthily SDK flow (Assessment / Chat) in the providers the stories use:
 * ThemeProvider + AssessmentProvider. The config is built from the credentials the
 * login flow stored via /healthily-login, so AssessmentProvider receives an
 * `authToken` and skips its internal login. GestureHandlerRootView is required for
 * the SDK's gesture-driven UI; fonts are already loaded by the root layout.
 */
export function YourMdProvider({ children }: { children: ReactNode }) {
  const apiKey = useAuthStore((s) => s.apiKey);
  const authToken = useAuthStore((s) => s.authToken);

  const config = useMemo(
    () => (apiKey && authToken ? buildAssessmentConfig(apiKey, authToken) : null),
    [apiKey, authToken],
  );

  // The route guard should prevent this, but never render the SDK without credentials.
  if (!config) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={sdkTheme}>
        <AssessmentProvider config={config}>{children}</AssessmentProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
