import signJwtToken from "../serverUtils/signJwtToken";

export default defineEventHandler(async (event) => {
  console.log('API handler called: authenticate.get');

  const user = event.context.user;
  if (!user) {
    throw createError({statusCode: 401, message: 'Unauthorized'});
  }

  const { userID, username, realName } = user;

  const userResObj = { userID, username, realName };
  const token = signJwtToken({ userID });
  return { token, user: userResObj };
})
