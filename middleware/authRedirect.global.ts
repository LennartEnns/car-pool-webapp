// Redirects user to login page if 'jwt' cookie is not set/invalid/expired.
// Else, redirects to /hello if user navigates to root path.

export default defineNuxtRouteMiddleware((to, from) => {
    const jwtCookie = useCookie('jwt');

    const expiryDate = getJwtExpiryDate(jwtCookie?.value);
    const jwtTokenInvalid = jwtCookie == null || jwtCookie.value == null || (!!expiryDate && expiryDate < new Date());

    if (to.path !== '/login' && jwtTokenInvalid) {
        return navigateTo('/login');
    }

    if (to.path === '/' && !jwtTokenInvalid) {
        return navigateTo('/hello');
    }
})