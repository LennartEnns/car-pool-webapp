import jwt from 'jsonwebtoken';

const runtimeConfig = useRuntimeConfig();
const privateKey = runtimeConfig.jwtPrivateKey as string;
const expirationTime = runtimeConfig.jwtExpirationTime as string;

export default (payload: object) => jwt.sign(payload, privateKey, { algorithm: 'ES512', expiresIn: expirationTime });
