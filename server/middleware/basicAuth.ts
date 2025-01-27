import decodeBasicAuth from "../serverUtils/decodeBasicAuth";
import bcrypt from "bcrypt";
import knex from '~/server/db/knex';
import { error401 } from "../errors";

/**
 * Middleware to authenticate the user using basic auth
 * First decodes the header.
 * Then queries the database for it.
 * Then compares the bcrypt hashes.
 * 
 * If the user is authenticated, the user object is added to the event context.
 */
export default defineEventHandler(async (event) => {
    if (!event.path.startsWith('/api/authenticate')) return; // Only use for authentication route

    console.log('Using middleware: basicAuth.ts');

    const authHeader = event.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        throw createError(error401);
    }

    const { username, password } = decodeBasicAuth(authHeader); // Extract credentials
    const user = await knex('user').first('userID', 'pwHash').where({username: username.toLowerCase()}); // Find the user in the database
    if (!user) {
        throw createError(error401);
    }
    const match = await bcrypt.compare(password, user.pwHash); // Compare the password
    if (!match) {
        throw createError(error401);
    }

    // Add the user to the event context
    event.context.user = { userID: user.userID };
})
