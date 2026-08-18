import { useCallback } from 'react';

import { useAuthStore } from '@/store/auth-store';

import { useHealthilyLogin } from './use-healthily-login';

/**
 * Reuse path: with a still-valid saved /login token, run ONLY /healthily-login to
 * re-issue the SDK credentials (which resets the assessment/chat session) and
 * write them into the auth store — no username/password form required. Setting the
 * healthily credentials flips `selectIsAuthenticated`, which the login screen's
 * redirect effect turns into navigation to the intended destination.
 */
export function useResumeSession() {
  const healthilyMutation = useHealthilyLogin();
  const loginToken = useAuthStore((s) => s.loginToken);
  const setHealthilyCredentials = useAuthStore((s) => s.setHealthilyCredentials);

  const resume = useCallback(async () => {
    if (!loginToken) throw new Error('no saved login token');
    const healthily = await healthilyMutation.mutateAsync(loginToken.access_token);
    setHealthilyCredentials(healthily);
  }, [healthilyMutation, loginToken, setHealthilyCredentials]);

  return {
    resume,
    isPending: healthilyMutation.isPending,
    error: healthilyMutation.error,
  };
}
