import knex from '~/server/db/knex';
import { error404, error500 } from '~/server/errors';

export default defineEventHandler(async (event) => {
  console.log('/api/users DELETE called');
  
  await knex('user')
    .where({
      userID: event.context.user?.userID,
    })
    .del()
    .catch(err => {
      console.error(`Error in /api/users DELETE: ${err}`);
      throw createError(error500);
    })
    .then(deletedRows => {
      if (deletedRows === 0) throw createError(error404);
    });

  return new Response(null, { status: 200 });
})
