import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { getUserQuerySchema } from "~/server/schemas/query/userQuerySchemas"

export default defineEventHandler(async (event) => {
  console.log('/api/users GET called');
  
  const query = await getValidatedQuery(event, data => getUserQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  return await knex('user')
    .first('userID', 'username', 'realName')
    .where('userID', query.data.userID || event.context.user?.userID) // Fallback to userID from event context
    .catch(err => {
      console.error(`Error in /api/users GET: ${err}`);
      throw createError(error500);
    })
    .then(user => {
      if (!user) throw createError(error404);
      return { user }
    });
})
