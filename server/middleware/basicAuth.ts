import decodeBasicAuth from "../serverUtils/auth/decodeBasicAuth";
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
    if (!event.path.startsWith('/api/auth/login')) return; // Only use for login route

    console.log('Using middleware: basicAuth.ts');

    const authHeader = getHeader(event, 'Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        throw createError(error401);
    }

    const { username, password } = decodeBasicAuth(authHeader); // Extract credentials
    const user = await knex('user').first('*').where({username: username.toLowerCase()});
    if (!user) {
        throw createError(error401);
    }
    const match = await bcrypt.compare(password, user.pwHash); // Compare the password
    if (!match) {
        throw createError(error401);
    }

    // Add the user to the event context
    event.context.user = { userID: user.userID, username: user.username, realName: user.realName };
})
