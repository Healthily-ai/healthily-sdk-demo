import { authApi } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

/** The `/login` response, and the inner `auth` of `/healthily-login`, share this shape. */
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** The `/healthily-login` response: SDK credentials for the consultation. */
export interface HealthilyLoginResponse {
  auth: AuthToken;
  api_key: string;
}

/** Portal-style username/password login — returns the bearer token for `/healthily-login`. */
export async function login(body: LoginRequest): Promise<AuthToken> {
  const { data } = await authApi.post<AuthToken>('/login', body);
  return data;
}

/** Exchanges the `/login` access token for the SDK's API credentials. */
export async function healthilyLogin(accessToken: string): Promise<HealthilyLoginResponse> {
  const { data } = await authApi.post<HealthilyLoginResponse>('/healthily-login', undefined, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}
