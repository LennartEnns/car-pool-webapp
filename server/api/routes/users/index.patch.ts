import { updateRouteUserQuerySchema } from '~/server/schemas/query/routeQuerySchemas';
import { updateRouteUserSchema } from '~/server/schemas/requestBody/routeBodySchemas';
import knex from '~/server/db/knex';
import { error400, error403, error404, error500 } from '~/server/errors';
import { checkRouteOwner } from '~/server/serverUtils/knexUtils/checkRouteOwner';

export default defineEventHandler(async (event) => {
  console.log('/api/routes/users PATCH called');

  const query = await getValidatedQuery(event, data => updateRouteUserQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);

  const result = await getValidatedQuery(event, body => updateRouteUserSchema.safeParse(body));
  if (!result.success) throw createError(error400);

  // Case A: User wants to update another user's association his own route
  if (!!query.data.userID) {
    // User can't remove himself from his own route
    if (query.data.userID === event.context.user?.userID) throw createError(error403);

    // Ensure that the route with routeID belongs to the user
    await checkRouteOwner(true, event.context.user?.userID, query.data.routeID);
  }
  // (Case B: User wants to update his own association to a route he does not own)

  await knex('userToRoute')
    .where({
      userID: query.data.userID || event.context.user?.userID,
      routeID: query.data.routeID,
    })
    .update(result.data)
    .catch(err => {
      console.error(`Error in /api/routes/users PATCH: ${err}`);
      throw createError(error500);
    })
    .then(updatedRows => {
      if (updatedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
