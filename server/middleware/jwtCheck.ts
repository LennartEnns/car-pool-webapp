import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error401 } from '../errors';

/**
 * Middleware to check if the JWT token is valid.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return; // Only apply to API routes
  if (event.path.startsWith('/api/auth')
      || (event.path.startsWith('/api/users') && event.method === 'POST'))
      return; // Do not apply to login, logout, refresh or registration route

  console.log('Using middleware: jwtCheck.ts');

  const jwtToken = getCookie(event, 'jwt');
  if (!jwtToken) throw createError(error401);

  const runtimeConfig = useRuntimeConfig(event);
  const publicKey = runtimeConfig.jwtPublicKey;
  try {
    const decoded = jwt.verify(jwtToken, publicKey, { algorithms: ['ES512'], clockTimestamp: new Date().getSeconds() }) as JwtPayload;
    if (!decoded || !decoded.userID) {
      console.log('JWT token is invalid');
      throw createError(error401);
    }
    // Add user ID to the event context
    event.context.user = { userID: decoded.userID };
  } catch (err) {
    throw createError(error401);
  }

  console.log("jwtCheck passed");
})
