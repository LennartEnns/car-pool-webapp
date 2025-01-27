import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { searchUserQuerySchema } from "~/server/schemas/query/userQuerySchemas"
import { validateUsernameSearchQuery, validateRealNameSearchQuery } from '~/commonRules';

export default defineEventHandler(async (event) => {
  console.log('/api/users/search GET called');
  
  const query = await getValidatedQuery(event, data => searchUserQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  if (!!query.data.username && !validateUsernameSearchQuery(query.data.username)) throw createError(error400);
  if (!!query.data.realName && !validateRealNameSearchQuery(query.data.realName)) throw createError(error400);

  // At least one of both properties is defined at this point (checked with zod)
  const searchAttr = (query.data.username ? 'username' : 'realName');
  const searchPattern = `%${(query.data.username || query.data.realName)}%`;
  return await knex('user')
    .select('userID', 'username', 'realName')
    .whereILike(searchAttr, searchPattern)
    .catch(err => {
      console.error(`Error in /api/users/search GET: ${err}`);
      throw createError(error500);
    })
    .then(user => {
      if (!user) throw createError(error404);
      return { user }
    });
})
