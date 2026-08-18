import { useMutation } from '@tanstack/react-query';

import { healthilyLogin, type HealthilyLoginResponse } from '@/lib/api/auth';

/** Mutation for POST /healthily-login — access token → SDK credentials. */
export function useHealthilyLogin() {
  return useMutation<HealthilyLoginResponse, Error, string>({ mutationFn: healthilyLogin });
}
