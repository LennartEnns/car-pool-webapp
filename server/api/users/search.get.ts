import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { searchUserQuerySchema } from "~/server/schemas/query/userQuerySchemas"
import { validateUsernameSearchQuery, validateRealNameSearchQuery } from '~/commonRules';

export default defineEventHandler(async (event) => {
  console.log('/api/users/search GET called');
  
  const query = await getValidatedQuery(event, data => searchUserQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  if ('username' in query.data && !validateUsernameSearchQuery(query.data.username)) throw createError(error400);
  if ('realName' in query.data && !validateRealNameSearchQuery(query.data.realName)) throw createError(error400);

  const searchAttr = ('username' in query.data ? 'username' : 'realName');
  const searchPattern = `%${('username' in query.data ? query.data.username : query.data.realName)}%`;
  return await knex('user')
    .select('userID', 'username', 'realName')
    .whereNot({userID: event.context.user?.userID}) // Exclude current user from the search
    .andWhereILike(searchAttr, searchPattern)
    .catch(err => {
      console.error(`Error in /api/users/search GET: ${err}`);
      throw createError(error500);
    })
    .then(user => {
      if (!user) throw createError(error404);
      return { user }
    });
})
