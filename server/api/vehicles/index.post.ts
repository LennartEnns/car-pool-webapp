import { createVehicleSchema } from '~/server/schemas/vehicleSchema';
import knex from '~/server/db/knex';
import { error400, error500 } from '~/server/errors';

export default defineEventHandler(async (event) => {
  console.log('/api/vehicle POST called');

  const result = await readValidatedBody(event, body => createVehicleSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  const vehicleData = { ...result.data, userID: event.context.user?.userID };
  try {
    await knex('vehicle').insert(vehicleData);
  } catch (err) {
    console.error(`Error in /api/vehicle POST: ${err}`);
    throw createError(error500);
  }
  
  return new Response(null, { status: 200 });
})
