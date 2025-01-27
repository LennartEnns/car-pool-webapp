import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { updateRideSchema } from '~/server/schemas/requestBody/rideBodySchemas';
import { rideIdQuerySchema } from '~/server/schemas/query/rideQuerySchemas';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/rides PATCH called');

  const query = await getValidatedQuery(event, data => rideIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const result = await readValidatedBody(event, body => updateRideSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  await knex('ride')
    .innerJoin('route', 'ride.routeID', 'route.routeID')
    .where({
      'route.userID': event.context.user?.userID, // Ensure that the route of the ride belongs to the user
      'ride.rideID': query.data.rideID,
    })
    .update(removeUndefinedEntries(result.data))
    .catch(err => {
      console.error(`Error in /api/rides PATCH: ${err}`);
      throw createError(error500);
    })
    .then(updatedRows => {
      if (updatedRows === 0) throw createError(error404);
    });
  
  return new Response(null, { status: 200 });
})
