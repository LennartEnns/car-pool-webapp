import { createRouteSchema } from '~/server/schemas/requestBody/routeBodySchemas';
import knex from '~/server/db/knex';
import { error400, error500 } from '~/server/errors';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/routes POST called');

  const result = await readValidatedBody(event, body => createRouteSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  const routeData = { ...result.data, userID: event.context.user?.userID };

  return await knex('route').insert(removeUndefinedEntries(routeData), ['routeID'])
    .catch(err => {
      console.error(`Error in /api/routes POST: ${err}`);
      throw createError(error500);
    })
    .then(datasets => {
      if (!datasets || datasets.length === 0) throw createError(error500);
      return { routeID: datasets[0].routeID };
    });
})
