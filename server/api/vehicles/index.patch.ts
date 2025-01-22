import knex from '~/server/db/knex';
import { error400, error500 } from '~/server/errors';
import { updateVehicleSchema } from '~/server/schemas/vehicleSchema';
import { vehicleIdQuerySchema } from '~/server/schemas/querySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/vehicle PATCH called');

  const query = await getValidatedQuery(event, data => vehicleIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const result = await readValidatedBody(event, body => updateVehicleSchema.safeParse(body))
  if (!result.success) {
    throw createError(error400);
  }
  
  try {
    await knex('vehicle').where({
      userID: event.context.user?.userID,
      vehicleID: query.data.vehicleID,
    }).update(result.data);
  } catch (err) {
    console.error(`Error in /api/vehicle PATCH: ${err}`);
    throw createError(error500);
  }
  
  return new Response(null, { status: 200 });
})
