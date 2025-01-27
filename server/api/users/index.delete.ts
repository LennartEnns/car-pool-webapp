import { useCookie } from 'nuxt/app';
import knex from '~/server/db/knex';
import { error400, error404, error500 } from '~/server/errors';

export default defineEventHandler(async (event) => {
  console.log('/api/users DELETE called');
  
  await knex('users')
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

  useCookie('jwt').value = null;
  return new Response(null, { status: 200 });
})
