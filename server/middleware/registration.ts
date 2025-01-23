import { error400, error401 } from '../errors';
import { registrationBodySchema } from '../schemas/userSchemas';

/**
 * Middleware to check if the registration key is valid.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/register')) return; // Only apply to registration route

  console.log('Using middleware: registration.ts');

  const regKey = event.headers.get('Authorization');
  if (!regKey) {
      throw createError(error401);
  }

  const runtimeConfig = useRuntimeConfig(event);
  const envRegKey = runtimeConfig.registrationKey;
  if (regKey !== envRegKey) {
    console.log('Invalid registration key');
    throw createError(error401);
  }
  console.log('Registration key is valid');

  const body = await readValidatedBody(event, body => registrationBodySchema.safeParse(body))
  if (!body.success) throw createError(error400);

  // Add user registration information to the event context
  event.context.user = body.data;
})
