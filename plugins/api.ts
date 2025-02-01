// Custom API fetcher with automatic token refreshing

import requestTokenRefresh from "~/utils/auth/requestTokenRefresh";

export default defineNuxtPlugin((nuxtApp) => {
  // Create a custom $fetch instance
  const api = $fetch.create({
    credentials: 'same-origin',
    baseURL: '/api',
    retry: 1, // Retry once
    retryStatusCodes: [401], // Retry only if 401 was received
    // async onRequest({ request, options }) {
    //   console.log("JWT: " + useCookie('jwt').value);
    //   console.log("Refresh: " + useCookie('refresh').value);
    // },
    async onResponse({ response, options }) {
      // Handle 401 errors (token expired)
      if (response.status === 401) {
        // Attempt to refresh the tokens
        console.log("$api: Trying to refresh...");
        const { status: refreshStatus } = await requestTokenRefresh(options.headers.get('cookie') || undefined);

        if (refreshStatus !== 200) {
          // If refresh was not successful, do not retry
          options.retry = false;
        }
        if (refreshStatus === 401) {
          console.log("$api: Refresh unauthenticated...");
          // If refresh token is invalid, log out
          // Later add other logout functionality (clearing state etc.)

          await nuxtApp.runWithContext(() => navigateTo('/login'));
          return;
        }
      }
    },
  });

  // Expose the custom fetcher as $api
  return {
    provide: {
      api,
    },
  };
});