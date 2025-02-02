import { signJwtToken, signRefreshToken } from '~/server/serverUtils/auth/jwt';
import { error401 } from "../../errors";

export default defineEventHandler(async (event) => {
  console.log('/api/auth/login POST called');

  const user = event.context.user;
  if (!user) {
    throw createError(error401);
  }

  const { userID, username, realName } = user;
  const jwtToken = signJwtToken({ userID });
  const refreshToken = signRefreshToken({ userID });

  const runtimeConfig = useRuntimeConfig(event);

  // Set cookies
  setCookie(event, 'jwt', jwtToken, {
    secure: runtimeConfig.secureCookies,
    httpOnly: true,
    sameSite: 'strict',
    path: '/api',
    maxAge: parseInt(runtimeConfig.jwtExpirationTime),
  });
  setCookie(event, 'refresh', refreshToken, {
    secure: runtimeConfig.secureCookies,
    httpOnly: true,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: parseInt(runtimeConfig.refreshExpirationTime),
  });

  return { user: { userID, username, realName: realName || undefined } };
})
