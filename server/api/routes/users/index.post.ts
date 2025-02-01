import { addRouteUserSchema } from '~/server/schemas/requestBody/routeBodySchemas';
import knex from '~/server/db/knex';
import { error400, error403, error500 } from '~/server/errors';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/routes/users POST called');

  const result = await readValidatedBody(event, body => addRouteUserSchema.safeParse(body))
  if (!result.success) throw createError(error400);
  
  const checkRouteOwner = async (mustBeOwner: boolean) => knex('route')
    .first(1)
    .where({
      routeID: result.data.routeID,
      userID: event.context.user?.userID,
    })
    .catch(err => {
      throw createError(error500);
    })
    .then(res => {
      if (mustBeOwner ? !res : !!res) throw createError(error403);
    });

  // Case A: User wants to add another user to his route
  if (!!result.data.userID) {
    // User can't add himself to his own route
    if (result.data.userID === event.context.user?.userID) throw createError(error403);

    // Ensure that the route with routeID belongs to the user
    await checkRouteOwner(true);
  }
  // Case B: User wants to add himself to a route he is not the owner of
   // Ensure that the route with routeID does not belong to the user
  else await checkRouteOwner(false);

  return await knex('userToRoute').insert(removeUndefinedEntries(result.data))
    .catch(err => {
      console.error(`Error in /api/routes/users POST: ${err}`);
      throw createError(error500);
    })
    .then(() => {
      return new Response(null, { status: 200 });
    });
})
