import knex from '~/server/db/knex';
import signJwtToken from "../myUtils/signJwtToken";
import { error500 } from "../errors";
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  console.log('API handler called: register.post');

  const { username, password, realName } = event.context.user;
  const pwHash = await bcrypt.hash(password, 10);

  const userIDs = await knex('user').insert({username, realName: realName || '', pwHash}, ['userID']);
  if (userIDs.length === 0) throw createError(error500);

  const token = signJwtToken({ userID: userIDs[0].userID, username, realName });
  return { token };
})

