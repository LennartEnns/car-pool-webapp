export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/login' || to.path === '/signup') return;

    const authenticated = useCookie('authenticated');

    // Redirect unauthenticated user to login page if navigation to non-public page is attempted
    if (!authenticated.value) {
        return navigateTo('/login');
    }

    // Redirects authenticated user to /home if navigation to root path is attempted.
    if (to.path === '/' && !!authenticated.value) {
        return navigateTo('/home');
    }
})
