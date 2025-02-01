import type { UseFetchOptions } from 'nuxt/app';

export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const cookieHeader = useRequestHeaders(['cookie']);
  console.log(cookieHeader);
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
    headers: {
      ...options?.headers,
      ...cookieHeader,
    },
  })
}
