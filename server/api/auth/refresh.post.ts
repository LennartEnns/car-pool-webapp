import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error401 } from '~/server/errors';
import { signJwtToken } from '~/server/serverUtils/auth/jwt';

export default defineEventHandler(async (event) => {
  console.log('/api/auth/refresh POST called');

  const refreshToken = getCookie(event, 'refresh');
  if (!refreshToken) {
    console.log('Refresh token not present');
    deleteCookie(event, 'jwt');
    throw createError(error401);
  }
  if (!!getCookie(event, 'jwt')) {
    console.log('Access token still present');
    return new Response(null, { status: 200 });
  }

  const runtimeConfig = useRuntimeConfig(event);
  const publicKey = runtimeConfig.refreshPublicKey;
  try {
    const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['ES512'], clockTimestamp: new Date().getSeconds() }) as JwtPayload;
    if (!decoded || !decoded.userID) {
      console.log('Refresh token is invalid');
      deleteCookie(event, 'jwt');
      deleteCookie(event, 'refresh');
      throw createError(error401);
    }
    console.log('Refresh token is valid');
    const newAccessToken = signJwtToken({ userID: decoded.userID });

    setCookie(event, 'jwt', newAccessToken, {
      secure: runtimeConfig.secureCookies,
      httpOnly: true,
      sameSite: 'strict',
      path: '/api',
      maxAge: parseInt(runtimeConfig.jwtExpirationTime),
    });
  } catch (err) {
    throw createError(error401);
  }

  return new Response(null, { status: 200 });
})
