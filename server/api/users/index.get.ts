import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { userIdQuerySchema } from "~/server/schemas/query/userQuerySchemas"

export default defineEventHandler(async (event) => {
  console.log('/api/users GET called');
  
  const query = await getValidatedQuery(event, data => userIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  return await knex('user')
    .first('username', 'realName')
    .where(query.data)
    .catch(err => {
      console.error(`Error in /api/users GET: ${err}`);
      throw createError(error500);
    })
    .then(user => {
      if (!user) throw createError(error404);
      return { user }
    });
})
