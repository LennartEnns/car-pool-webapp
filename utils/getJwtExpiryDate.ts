import parseJwtPayload from './parseJwtPayload';

export default (jwtToken: string | null | undefined): Date | null => {
  if (!jwtToken) return null;
  const payload = parseJwtPayload(jwtToken);
  if (!payload.exp) return null;
  return new Date(payload.exp * 1000);
}