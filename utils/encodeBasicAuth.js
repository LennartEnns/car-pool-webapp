import { Buffer } from 'buffer';

/**
 * Encodes a username and password into a Basic Auth string
 * @param {string} username
 * @param {string} password
 * @returns {string} Basic Auth string
 */
export default (username, password) => {
  const base64 = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${base64}`;
}