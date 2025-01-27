import knex from '~/server/db/knex';
import signJwtToken from '~/server/serverUtils/signJwtToken';
import { error400, error409, error500 } from '~/server/errors';
import { validateUsername, validateRealNameBeforeTitleCase } from '~/commonRules';
import bcrypt from 'bcrypt';
import toTitleCase from '~/utils/toTitleCase';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';

export default defineEventHandler(async (event) => {
  console.log('/api/users POST called');

  const { username, password, realName } = event.context.user;

  // Username normalization + validation
  const normalizedUsername = username.trim();
  if (normalizedUsername.length === 0 || !validateUsername(normalizedUsername)) throw createError(error400);

  // Real name normalization + validation
  let normalizedRealName = realName;
  if (!!realName) {
    const trimmedRealName = realName.trim();
    if (!validateRealNameBeforeTitleCase(trimmedRealName)) throw createError(error400);
    normalizedRealName = toTitleCase(trimmedRealName);
  }

  // Check if the username is taken
  await knex('user').first().where({username: normalizedUsername})
  .catch(err => {
    throw createError(error500);
  })
  .then(user => {
    if (!!user) throw createError(error409); // Conflict: User already exists
  });

  const pwHash = await bcrypt.hash(password, 10);
  const insertObj = removeUndefinedEntries({username: normalizedUsername, realName: normalizedRealName, pwHash});
  return await knex('user').insert(insertObj, ['userID'])
  .catch(err => {
    throw createError(error500);
  })
  .then(datasets => {
    if (!datasets || datasets.length === 0) throw createError(error500);
    const userID = datasets[0].userID;

    const user = removeUndefinedEntries({ userID, username: normalizedUsername, name: normalizedRealName });
    const token = signJwtToken({userID});
    return { token, user };
  });
})
