import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { routeIdQuerySchema } from '~/server/schemas/query/routeQuerySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/routes DELETE called');

  const query = await getValidatedQuery(event, data => routeIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  await knex('route')
    .where({
      userID: event.context.user?.userID,
      routeID: query.data.routeID,
    })
    .del()
    .catch(err => {
      console.error(`Error in /api/routes DELETE: ${err}`);
      throw createError(error500);
    })
    .then(deletedRows => {
      if (deletedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
