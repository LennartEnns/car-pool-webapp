/**
 * Uses a cookie to store the user's preferred role.
 */
export function usePreferredRole() {
  return useCookie('preferredRole', { 
    // Only use for homepage
    path: '/home',
   });
}
