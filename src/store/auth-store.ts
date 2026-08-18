import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Token } from '@yourmd/yourmd-react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthToken, HealthilyLoginResponse } from '@/lib/api/auth';

export type AuthState = {
  /**
   * Token from POST /login, enriched with `expires_at`. This is the ONLY
   * persisted field (see below) — the bearer we reuse to skip the login form on
   * a return visit while it's still valid.
   */
  loginToken: Token | null;
  /** `api_key` from /healthily-login — the SDK's x-api-key. Ephemeral. */
  apiKey: string | null;
  /** `auth` from /healthily-login, enriched with `expires_at` — the SDK's authToken. Ephemeral. */
  authToken: Token | null;
  /** True once the persisted store has finished rehydrating from AsyncStorage. */
  hasHydrated: boolean;
  setLoginToken: (token: AuthToken) => void;
  setHealthilyCredentials: (response: HealthilyLoginResponse) => void;
  /** Drop the ephemeral SDK session (apiKey/authToken); KEEP the persisted loginToken. */
  resetSession: () => void;
  /** Clear everything, including the persisted loginToken — forces a fresh /login. */
  logout: () => void;
};

/**
 * Only `loginToken` is persisted (to AsyncStorage, via the `persist` middleware
 * below). It survives reload/restart so a returning user who taps a CTA can skip
 * the username/password form while the token is unexpired; once it expires the
 * form is shown again. `apiKey`/`authToken` are deliberately NOT persisted: they
 * are re-issued by /healthily-login on every visit, which resets the SDK session.
 * The assessment/chat screens `resetSession()` on unmount so returning to "/"
 * drops the SDK session (re-running /healthily-login next visit) but keeps the
 * saved login for reuse.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loginToken: null,
      apiKey: null,
      authToken: null,
      hasHydrated: false,
      setLoginToken: (token) =>
        // Stamp expiry now so it can be checked across reloads without a server round-trip.
        set({ loginToken: { ...token, expires_at: Date.now() + token.expires_in * 1000 } }),
      setHealthilyCredentials: ({ auth, api_key }) =>
        set({
          apiKey: api_key,
          // Compute expiry now so the SDK's expiry watchers (which read `expires_at`)
          // and our route guard agree on when the session ends.
          authToken: { ...auth, expires_at: Date.now() + auth.expires_in * 1000 },
        }),
      resetSession: () => set({ apiKey: null, authToken: null }),
      logout: () => set({ loginToken: null, apiKey: null, authToken: null }),
    }),
    {
      name: 'yourmd-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only the reusable login token — never the ephemeral SDK credentials.
      partialize: (state) => ({ loginToken: state.loginToken }),
      // `web.output: "static"` prerenders in Node (no localStorage); rehydrate is
      // triggered client-side from the root layout instead of at store creation.
      skipHydration: true,
      // Flip the reactive flag even on error so the splash never hangs (e.g. blocked
      // localStorage in private mode) — we just fall back to the login form.
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
    },
  ),
);

/** Authenticated iff we hold an unexpired SDK access token. Gates the assessment/chat routes. */
export const selectIsAuthenticated = (state: AuthState): boolean =>
  !!state.authToken && state.authToken.expires_at > Date.now();

/** True iff a saved /login token exists and hasn't expired — lets us skip the login form. */
export const selectHasValidLogin = (state: AuthState): boolean =>
  !!state.loginToken && state.loginToken.expires_at > Date.now();

/** True once the persisted store has rehydrated — consumers must wait for this. */
export const selectHasHydrated = (state: AuthState): boolean => state.hasHydrated;
