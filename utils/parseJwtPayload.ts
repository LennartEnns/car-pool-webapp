/** Utility function for parsing JWT payload.
 * @param {string} token - The JWT token to parse.
 * @returns {Object} The payload in the JWT token. Empty object if token is invalid.
*/
import { Buffer } from 'buffer';

export default (token: string) => {
    if (!token || token.split('.').length < 2) {
        return {};
    }

    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        console.error('Error parsing JWT payload:', e);
        return {};
    }
}