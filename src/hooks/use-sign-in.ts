import { useCallback } from 'react';

import type { LoginRequest } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';

import { useHealthilyLogin } from './use-healthily-login';
import { useLogin } from './use-login';

/**
 * Orchestrates the full sign-in: /login → /healthily-login, writing both
 * credential sets into the auth store. Setting the healthily credentials flips
 * `selectIsAuthenticated`, which mounts the gated (assessment/chat) screens and
 * lets the login screen redirect the user to their intended destination.
 */
export function useSignIn() {
  const loginMutation = useLogin();
  const healthilyMutation = useHealthilyLogin();
  const setLoginToken = useAuthStore((s) => s.setLoginToken);
  const setHealthilyCredentials = useAuthStore((s) => s.setHealthilyCredentials);

  const signIn = useCallback(
    async (credentials: LoginRequest) => {
      const token = await loginMutation.mutateAsync(credentials);
      setLoginToken(token);
      const healthily = await healthilyMutation.mutateAsync(token.access_token);
      setHealthilyCredentials(healthily);
    },
    [loginMutation, healthilyMutation, setLoginToken, setHealthilyCredentials],
  );

  return {
    signIn,
    isPending: loginMutation.isPending || healthilyMutation.isPending,
    error: loginMutation.error ?? healthilyMutation.error,
  };
}
