import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { getRouteQuerySchema } from '~/server/schemas/query/routeQuerySchemas';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/routes GET called');

  const query = await getValidatedQuery(event, data => getRouteQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  return await knex('route')
    .select('*')
    .where(removeUndefinedEntries(query.data))
    .orderBy('name', 'asc')
    .catch(err => {
      console.error(`Error in /api/routes GET: ${err}`);
      throw createError(error500);
    })
    .then(routes => {
      if (!!query.data.routeID) {
        if (routes.length === 0) throw createError(error404);
        return { route: routes[0] }
      }
      return routes;
    });
})
