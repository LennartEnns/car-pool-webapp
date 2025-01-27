import { z } from 'zod';
import { uuidSchema } from '../valueSchemas';

export default z.object({
    rideID: uuidSchema,
    routeID: uuidSchema,
    startDatetime: z.string().datetime().nullable(),
    arrivalDatetime: z.string().datetime(),
    customDistance: z.number().nonnegative().step(0.01).nullable(),
    customBothWays: z.boolean().nullable(),
    reverseDirection: z.boolean(),
});
