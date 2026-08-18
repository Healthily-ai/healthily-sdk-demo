import {
  createTheme,
  type AssessmentConfig,
  type Token,
} from "@yourmd/yourmd-react-native";

import { getApiBaseUrl } from "@/lib/config";

/**
 * Builds the Healthily SDK config from credentials obtained via /healthily-login
 * (see the auth store). Passing `authentication: { authToken }` makes
 * `AssessmentProvider` skip its own partner login and start the consultation
 * directly — the same outcome the SDK's `LoginWrapper` produces. `baseUrl` is the
 * SDK's `/api` host, resolved by `getApiBaseUrl()` (runtime `/env.js` on web, the
 * baked `EXPO_PUBLIC_API_URL` on native); `apiKey` now comes from the
 * /healthily-login response rather than an env var.
 */
export function buildAssessmentConfig(
  apiKey: string,
  authToken: Token,
): AssessmentConfig {
  return {
    baseUrl: `${getApiBaseUrl()}/api`,
    apiKey,
    authentication: { authToken },
  };
}

/** Mirrors the stories' `themes.dark` (a createTheme with a white override). */
export const sdkTheme = createTheme({
  colors: { "neutral/neutral-white": "#FFFFFF" },
});
