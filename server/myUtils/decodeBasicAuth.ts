export default (basicAuthHeader: string): { username: string, password: string } => {
    const base64Credentials = basicAuthHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    return { username, password };
};