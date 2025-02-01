import jwt from 'jsonwebtoken';

const runtimeConfig = useRuntimeConfig();
const jwtPrivateKey = runtimeConfig.jwtPrivateKey as string;
const jwtExpirationTime = runtimeConfig.jwtExpirationTime as string;
const refreshPrivateKey = runtimeConfig.refreshPrivateKey as string;
const refreshExpirationTime = runtimeConfig.refreshExpirationTime as string;

export const signJwtToken = (payload: object) => jwt.sign(payload, jwtPrivateKey, { algorithm: 'ES512', expiresIn: jwtExpirationTime });
export const signRefreshToken = (payload: object) => jwt.sign(payload, refreshPrivateKey, { algorithm: 'ES512', expiresIn: refreshExpirationTime });
