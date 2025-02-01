import knex from '~/server/db/knex';
import { error400, error403, error500 } from '~/server/errors';
import { routeIdQuerySchema } from '~/server/schemas/query/routeQuerySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/routes/users GET called');

  const query = await getValidatedQuery(event, data => routeIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  // Only allow access if the user is an owner/participant of the route
  await knex('route')
    .first(1)
    .where({userID: event.context.user?.userID})
    .union(
      knex('userToRoute')
      .first(1)
      .where({userID: event.context.user?.userID})
    )
    .catch(err => {
      throw createError(error500);
    })
    .then(val => {
      if (!val) throw createError(error403);
    });

  return await knex('userToRoute')
    .select('userID', 'bothWays')
    .where({ routeID: query.data.routeID })
    .catch(err => {
      throw createError(error500);
    })
    .then(users => {
      return { users };
    })
})
