import { create } from "axios";

import { getApiBaseUrl } from "@/lib/config";

/**
 * Axios instance for the demo auth API (`/login`, `/healthily-login`).
 * Base URL is resolved by `getApiBaseUrl()` — on web the value comes from the
 * container's runtime `/env.js` (so one image serves any environment); on native
 * it's the baked `EXPO_PUBLIC_API_URL`. Distinct from the SDK's `/api` base.
 */
export const authApi = create({
  baseURL: `${getApiBaseUrl()}/demo`,
  headers: { "Content-Type": "application/json" },
});
