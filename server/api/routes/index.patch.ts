import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';
import { updateRouteSchema } from '~/server/schemas/requestBody/routeBodySchemas';
import { routeIdQuerySchema } from '~/server/schemas/query/routeQuerySchemas';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/routes PATCH called');

  const query = await getValidatedQuery(event, data => routeIdQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const result = await readValidatedBody(event, body => updateRouteSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  await knex('route')
    .where({
      userID: event.context.user?.userID,
      routeID: query.data.routeID,
    })
    .update(removeUndefinedEntries(result.data))
    .catch(err => {
      console.error(`Error in /api/routes PATCH: ${err}`);
      throw createError(error500);
    })
    .then(updatedRows => {
      if (updatedRows === 0) throw createError(error404);
    });
  
  return new Response(null, { status: 200 });
})
