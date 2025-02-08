import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { getRouteQuerySchema } from '~/server/schemas/query/routeQuerySchemas';
import { z } from 'zod';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/routes GET called');

  const query = await getValidatedQuery(event, data => getRouteQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const queryObj: z.infer<typeof getRouteQuerySchema> & { userID: string | undefined } = {
    ...query.data,
    // If routeID is specified, userID should not be specified
    userID: ('routeID' in query.data) ? undefined : ('userID' in query.data ? query.data.userID : event.context.user?.userID),
  };

  // Implicitly use preview mode if route is not requested by ID
  let preview = !('routeID' in queryObj);
  if ('preview' in queryObj) {
    preview = (queryObj.preview === 'true');
    delete queryObj.preview;
  }


  const sqlAttributes = (preview ? ['route.routeID', 'name', 'validFrom', 'validTo'] : '*');

  const passengerMode = ('passenger' in queryObj);
  // In passenger mode, return routes that the user is a passenger of
  if (passengerMode) return await knex('route')
    .select(sqlAttributes)
    .join('userToRoute', 'route.routeID', 'userToRoute.routeID')
    .where('userToRoute.userID', queryObj.userID)
    .orderBy('name', 'asc')
    .catch(err => {
      console.error(`Error in /api/routes GET: ${err}`);
      throw createError(error500);
    })
    .then(routes => {
      return routes;
    });

  return await knex('route')
    .select(sqlAttributes)
    .where(removeUndefinedEntries(queryObj))
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
