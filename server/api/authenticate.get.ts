import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  console.log('API handler called: authenticate.get');

  const user = event.context.user;
  if (!user) {
    throw createError({statusCode: 401, message: 'Unauthorized'});
  }

  const { username, name } = user;
  const runtimeConfig = useRuntimeConfig(event);
  const privateKey = runtimeConfig.jwtPrivateKey as string;
  const expirationTime = runtimeConfig.jwtExpirationTime as string;

  const token = jwt.sign({ username, name }, privateKey, { algorithm: 'ES512', expiresIn: expirationTime });
  return { token };
})