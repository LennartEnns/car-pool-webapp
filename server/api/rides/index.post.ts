import { createRideSchema } from '~/server/schemas/requestBody/rideBodySchemas';
import knex from '~/server/db/knex';
import { error400, error403, error500 } from '~/server/errors';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/rides POST called');

  const result = await readValidatedBody(event, body => createRideSchema.safeParse(body))
  if (!result.success) throw createError(error400);

  // Ensure that the route with routeID belongs to the user
  await knex('route')
    .first(1)
    .where({
      routeID: result.data.routeID,
      userID: event.context.user?.userID,
    })
    .catch(err => {
      throw createError(error500);
    })
    .then(res => {
      if (!res) throw createError(error403);
    });

  return await knex('ride').insert(removeUndefinedEntries(result.data), ['rideID'])
    .catch(err => {
      console.error(`Error in /api/rides POST: ${err}`);
      throw createError(error500);
    })
    .then(datasets => {
      if (!datasets || datasets.length === 0) throw createError(error500);
      return { rideID: datasets[0].rideID };
    });
})
