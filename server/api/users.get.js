import knex from '~/server/db/knex';

export default defineEventHandler(async (event) => {
  try {
    // Fetch all users from the 'user' table
    const users = await knex('user').select('username');

    return {
      success: true,
      data: {users},
    };
  } catch (error) {
    // Handle errors
    console.error(error);
    return {
      success: false,
      message: 'Unexpected error',
    };
  }
})
