import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { rideIdQuerySchema } from '~/server/schemas/query/rideQuerySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/rides DELETE called');

  const query = await getValidatedQuery(event, data => rideIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  await knex('ride')
    .innerJoin('route', 'ride.routeID', 'route.routeID')
    .where({
      'route.userID': event.context.user?.userID, // Ensure that the route of the ride belongs to the user
      'ride.rideID': query.data.rideID,
    })
    .del()
    .catch(err => {
      console.error(`Error in /api/rides DELETE: ${err}`);
      throw createError(error500);
    })
    .then(deletedRows => {
      if (deletedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
