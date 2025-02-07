import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { getRouteQuerySchema } from '~/server/schemas/query/routeQuerySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/routes GET called');

  const query = await getValidatedQuery(event, data => getRouteQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const queryObj = query.data;
  if (!('routeID' in queryObj) && !queryObj.userID) queryObj.userID = event.context.user?.userID;
  const preview = queryObj.preview || false;
  delete queryObj.preview;

  return await knex('route')
    .select(preview ? ['routeID', 'name'] : '*')
    .where(queryObj)
    .orderBy('name', 'asc')
    .catch(err => {
      console.error(`Error in /api/routes GET: ${err}`);
      throw createError(error500);
    })
    .then(routes => {
      if ('routeID' in query.data) {
        if (routes.length === 0) throw createError(error404);
      }
      return routes;
    });
})
