import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error401 } from '../errors';

/**
 * Middleware to check if the JWT token is valid.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) return; // Only apply to API routes
  if (event.path.startsWith('/api/authenticate')
      || (event.path.startsWith('/api/users') && event.method === 'POST'))
      return; // Do not apply to authentication or registration route

  console.log('Using middleware: jwtCheck.ts');

  const cookies = parseCookies(event);

  const jwtToken = cookies?.jwt;

  const runtimeConfig = useRuntimeConfig(event);
  const publicKey = runtimeConfig.jwtPublicKey;
  const decoded = jwt.verify(jwtToken, publicKey, { algorithms: ['ES512'], clockTimestamp: new Date().getSeconds() }) as JwtPayload;

  if (!decoded || !decoded.userID) {
    console.log('JWT token is invalid');
    throw createError(error401);
  }

  console.log('JWT token is valid');

  // Add relevant user information to the event context
  event.context.user = { userID: decoded.userID };
})