import knex from '~/server/db/knex';
import { error400, error403, error404, error500 } from '~/server/errors';
import { getRideQuerySchema } from '~/server/schemas/query/rideQuerySchemas';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';
import { rideLimits } from '~/commonLimits';

export default defineEventHandler(async (event) => {
  console.log('/api/rides GET called');

  const query = await getValidatedQuery(event, data => getRideQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  // Only allow access by routeID if the user is an owner/participant of the route
  if ('routeID' in query.data) {
    await knex('route')
      .first('userID')
      .where({userID: event.context.user.userID})
      .union(
        knex('userToRoute')
        .first('userID')
        .where({userID: event.context.user?.userID})
      )
      .catch(err => {
        throw createError(error500);
      })
      .then(userID => {
        if (!userID) throw createError(error403);
      });
  }

  return await knex('ride')
    .select('*')
    .where(removeUndefinedEntries(query.data))
    .orderBy('arrivalDatetime', 'desc')
    .limit(rideLimits.maxGetResults, { skipBinding: true }) // Limit number of returned results
    .catch(err => {
      console.error(`Error in /api/rides GET: ${err}`);
      throw createError(error500);
    })
    .then(rides => {
      if ('rideID' in query.data) {
        if (rides.length === 0) throw createError(error404);
      }
      return rides;
    });
})
