import { z } from 'zod';
import { uuidSchema } from '../valueSchemas';
import { vehicleLimits } from '~/commonLimits';

export default z.object({
    vehicleID: uuidSchema,
    userID: uuidSchema,
    name: z.string().max(vehicleLimits.name),
    model: z.string().max(vehicleLimits.model).nullable(),
    description: z.string().max(vehicleLimits.description),
    consumption: z.number().nonnegative().step(0.01),
    electric: z.boolean(),
});
