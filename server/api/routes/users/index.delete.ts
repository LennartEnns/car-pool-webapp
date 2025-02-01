import { deleteRouteUserQuerySchema } from '~/server/schemas/query/routeQuerySchemas';
import knex from '~/server/db/knex';
import { error400, error403, error404, error500 } from '~/server/errors';
import { checkRouteOwner } from '~/server/serverUtils/knexUtils/checkRouteOwner';

export default defineEventHandler(async (event) => {
  console.log('/api/routes/users DELETE called');

  const query = await getValidatedQuery(event, data => deleteRouteUserQuerySchema.safeParse(data));
  if (!query.success) throw createError(error400);
  
  // Case A: User wants to remove another user from his own route
  if (!!query.data.userID) {
    // User can't remove himself from his own route
    if (query.data.userID === event.context.user?.userID) throw createError(error403);

    // Ensure that the route with routeID belongs to the user
    await checkRouteOwner(true, event.context.user?.userID, query.data.routeID);
  }
  // Case B: User wants to remove himself from a route
  else await checkRouteOwner(false, event.context.user?.userID, query.data.routeID);

  await knex('userToRoute')
    .where({
      userID: query.data.userID || event.context.user?.userID,
      routeID: query.data.routeID,
    })
    .del()
    .catch(err => {
      console.error(`Error in /api/routes/users DELETE: ${err}`);
      throw createError(error500);
    })
    .then(deletedRows => {
      if (deletedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
