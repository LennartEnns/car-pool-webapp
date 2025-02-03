import knex from '~/server/db/knex';
import { error400, error403, error404, error409, error500 } from '~/server/errors';
import { validateUsername, validateRealNameBeforeTitleCase } from '~/commonRules';
import bcrypt from 'bcrypt';
import toTitleCase from '~/utils/toTitleCase';
import removeUndefinedEntries from '~/utils/removeUndefinedEntries';
import { updateUserSchema } from '~/server/schemas/requestBody/userBodySchemas';

export default defineEventHandler(async (event) => {
  console.log('/api/users PATCH called');

  // Body validation
  const result = await readValidatedBody(event, body => updateUserSchema.safeParse(body))
  if (!result.success) throw createError(error400);

  // (Old) password validation
  const oldPassword = getHeader(event, 'Authorization');
  if (oldPassword === undefined) throw createError(error403);
  const user = await knex('user').first('pwHash').where({ userID: event.context.user?.userID });
  if (!user) {
    console.log('abc');
    throw createError(error404);
  }
  const match = await bcrypt.compare(oldPassword, user.pwHash);
  if (!match) {
    throw createError(error403);
  }

  const { username, realName, password } = result.data;

  // Username normalization + validation
  const normalizedUsername = username?.trim();
  if (!!normalizedUsername && (normalizedUsername.length === 0 || !validateUsername(normalizedUsername))) throw createError(error400);

  // Real name normalization + validation
  let normalizedRealName = realName;
  if (!!realName) {
    const trimmedRealName = realName.trim();
    if (!validateRealNameBeforeTitleCase(trimmedRealName)) throw createError(error400);
    normalizedRealName = toTitleCase(trimmedRealName);
  }

  // Check if the username is taken
  if (!!normalizedUsername) {
    await knex('user').first()
    .where({username: normalizedUsername})
    .andWhereNot({userID: event.context.user?.userID})
    .catch(err => {
      throw createError(error500);
    })
    .then(user => {
      if (!!user) throw createError(error409); // Conflict: User already exists
    });
  }

  const pwHash = !!password ? await bcrypt.hash(password, 10) : undefined;
  const updateObj = removeUndefinedEntries({username: normalizedUsername, realName: normalizedRealName, pwHash});

  return await knex('user')
    .where({
      userID: event.context.user?.userID,
    })
    .update(updateObj, ['username', 'realName'])
    .catch(err => {
      console.error(`Error in /api/users PATCH: ${err}`);
      throw createError(error500);
    })
    .then(datasets => {
      if (!datasets || datasets.length === 0) throw createError(error404);
      return { newUser: datasets[0] };
    });
})
