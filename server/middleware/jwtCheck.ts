import jwt, { type JwtPayload } from 'jsonwebtoken';

/**
 * Middleware to check if the JWT token is valid.
 */
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/authenticate')) return;

  console.log('Using middleware: jwtAuth.ts');

  const cookies = parseCookies(event);

  const jwtToken = cookies?.jwt;

  const error401 = {
    statusCode: 401,
    statusMessage: 'Unauthorized',
  }

  const runtimeConfig = useRuntimeConfig(event);
  const publicKey = runtimeConfig.jwtPublicKey as string;
  const decoded = jwt.verify(jwtToken, publicKey, { algorithms: ['ES512'], clockTimestamp: new Date().getSeconds() }) as JwtPayload;

  if (!decoded) {
    console.log('JWT token is invalid');
    throw createError(error401);
  }

  console.log('JWT token is valid');
})