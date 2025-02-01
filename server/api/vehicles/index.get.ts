import knex from '~/server/db/knex';
import { error400, error403, error404, error500 } from '~/server/errors';
import { getVehicleQuerySchema } from '~/server/schemas/query/vehicleQuerySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/vehicles GET called');

  const query = await getValidatedQuery(event, data => getVehicleQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  if ('userID' in query.data && !!query.data.userID && query.data.userID !== event.context.user?.userID) {
    throw createError(error403);
  }
  const searchObj = { ...query.data, userID: 'userID' in query.data ? (query.data.userID || event.context.user?.userID) : event.context.user?.userID };

  return await knex('vehicle')
    .select('vehicleID', 'name', 'model', 'description', 'consumption', 'electric')
    .where(searchObj)
    .orderBy('name', 'asc')
    .catch(err => {
      console.error(`Error in /api/vehicle GET: ${err}`);
      throw createError(error500);
    })
    .then(vehicles => {
      if ('vehicleID' in query.data) {
        if (vehicles.length === 0) throw createError(error404);
      }
      return vehicles;
    });
})
