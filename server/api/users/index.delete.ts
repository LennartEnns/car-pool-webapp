import knex from '~/server/db/knex';
import bcrypt from 'bcrypt';
import { error403, error404, error500 } from '~/server/errors';

export default defineEventHandler(async (event) => {
  console.log('/api/users DELETE called');
  
  const password = getHeader(event, 'Authorization');
  if (password === undefined) throw createError(error403);
  const user = await knex('user').first('pwHash').where({ userID: event.context.user?.userID });
  if (!user) {
    throw createError(error404);
  }
  const match = await bcrypt.compare(password, user.pwHash);
  if (!match) {
    throw createError(error403);
  }

  await knex('user')
    .where({
      userID: event.context.user?.userID
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
