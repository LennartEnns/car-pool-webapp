// Redirects user to login page if 'jwt' cookie is not set/invalid/expired.
// Else, redirects to /home if user navigates to root path.

export default defineNuxtRouteMiddleware((to, from) => {
    const jwtCookie = useCookie('jwt');

    const expiryDate = getJwtExpiryDate(jwtCookie?.value);
    const jwtTokenInvalid = jwtCookie.value == null || (!!expiryDate && expiryDate < new Date());
    if (jwtTokenInvalid) jwtCookie.value = null;

    if (to.path !== '/login' && to.path !== '/signup' && jwtTokenInvalid) {
        return navigateTo('/login');
    }

    if (to.path === '/' && !jwtTokenInvalid) {
        return navigateTo('/home');
    }
})
