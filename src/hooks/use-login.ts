import { useMutation } from '@tanstack/react-query';

import { login, type AuthToken, type LoginRequest } from '@/lib/api/auth';

/** Mutation for POST /login — username/password → access token. */
export function useLogin() {
  return useMutation<AuthToken, Error, LoginRequest>({ mutationFn: login });
}
