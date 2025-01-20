import knex from '~/server/db/knex';

export default defineEventHandler(async (event) => {
  console.log(event.context.user);
  return "Hallo!";
})
