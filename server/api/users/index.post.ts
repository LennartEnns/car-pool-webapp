import knex from '~/server/db/knex';
import signJwtToken from '~/server/serverUtils/signJwtToken';
import { error400, error409, error500 } from '~/server/errors';
import { validateUsername, validateRealNameBeforeTitleCase } from '~/commonRules';
import bcrypt from 'bcrypt';
import toTitleCase from '~/utils/toTitleCase';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

import { z } from 'zod';
import { registrationBodySchema } from '~/server/schemas/requestBody/userBodySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/users POST called');

  type RegBody = z.infer<typeof registrationBodySchema>;
  const { username, password, realName }: RegBody = event.context.user;

  // Username normalization + validation
  const finalUsername = username.trim();
  if (finalUsername.length === 0 || !validateUsername(finalUsername)) throw createError(error400);

  // Real name normalization + validation
  let finalRealName = realName;
  if (!!realName) {
    const trimmedRealName = realName.trim();
    if (!validateRealNameBeforeTitleCase(trimmedRealName)) throw createError(error400);
    finalRealName = toTitleCase(trimmedRealName);
  }

  // Check if the username is taken
  await knex('user').first().where({username: finalUsername})
  .catch(err => {
    throw createError(error500);
  })
  .then(user => {
    if (!!user) throw createError(error409); // Conflict: User already exists
  });

  const pwHash = await bcrypt.hash(password, 10);
  const insertObj = removeUndefinedEntries({username: finalUsername, realName: finalRealName, pwHash});
  return await knex('user').insert(insertObj, ['userID'])
  .catch(err => {
    throw createError(error500);
  })
  .then(datasets => {
    if (!datasets || datasets.length === 0) throw createError(error500);
    const userID: string = datasets[0].userID;
    const token = signJwtToken({userID});
    return { token };
  });
})
