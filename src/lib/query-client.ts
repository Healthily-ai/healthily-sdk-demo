import { QueryClient } from '@tanstack/react-query';

/** Shared TanStack Query client, mounted via QueryClientProvider in the root layout. */
export const queryClient = new QueryClient();
