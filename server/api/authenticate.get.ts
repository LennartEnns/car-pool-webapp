import signJwtToken from "../myUtils/signJwtToken";

export default defineEventHandler(async (event) => {
  console.log('API handler called: authenticate.get');

  const user = event.context.user;
  if (!user) {
    throw createError({statusCode: 401, message: 'Unauthorized'});
  }

  const { userID, username, name } = user;

  const token = signJwtToken({ userID, username, name });
  return { token };
})
