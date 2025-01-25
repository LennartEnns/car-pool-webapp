import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { vehicleIdQuerySchema } from '~/server/schemas/querySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/vehicle DELETE called');

  const query = await getValidatedQuery(event, data => vehicleIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  await knex('vehicle')
    .where({
      userID: event.context.user?.userID,
      vehicleID: query.data.vehicleID,
    })
    .del()
    .catch(err => {
      console.error(`Error in /api/vehicle DELETE: ${err}`);
      throw createError(error500);
    })
    .then(deletedRows => {
      if (deletedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
