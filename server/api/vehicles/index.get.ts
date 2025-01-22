import knex from '~/server/db/knex';
import { error400, error500 } from '~/server/errors';
import { userIdQuerySchema } from '~/server/schemas/querySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/vehicles GET called');

  const query = await getValidatedQuery(event, data => userIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  if (query.data.userID !== event.context.user?.userID) {
    throw createError({statusCode: 401, message: 'Unauthorized'});
  }

  try {
    const vehicles = await knex('vehicle')
      .select('vehicleID', 'name', 'model', 'description', 'consumption', 'electric')
      .where({ userID: query.data.userID });
    return { vehicles };
  } catch (err) {
    console.error(`Error in /api/vehicle GET: ${err}`);
    throw createError(error500);
  }
})
