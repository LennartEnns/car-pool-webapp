import { createVehicleSchema } from '~/server/schemas/requestBody/vehicleBodySchemas';
import knex from '~/server/db/knex';
import { error400, error500 } from '~/server/errors';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event): Promise<{vehicleID: string}> => {
  console.log('/api/vehicle POST called');

  const result = await readValidatedBody(event, body => createVehicleSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  const vehicleData = { ...result.data, userID: event.context.user?.userID };

  return await knex('vehicle').insert(removeUndefinedEntries(vehicleData), ['vehicleID'])
    .catch(err => {
      console.error(`Error in /api/vehicle POST: ${err}`);
      throw createError(error500);
    })
    .then(datasets => {
      if (!datasets || datasets.length === 0) throw createError(error500);
      return { vehicleID: datasets[0].vehicleID };
    });
})
