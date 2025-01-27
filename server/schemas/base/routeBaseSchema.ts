import { z } from 'zod';
import { uuidSchema } from '../valueSchemas';
import { routeLimits } from '~/commonLimits';

export default z.object({
    routeID: uuidSchema,
    userID: uuidSchema,
    vehicleID: uuidSchema,
    name: z.string().max(routeLimits.name),
    description: z.string().max(routeLimits.description),
    distance: z.number().nonnegative().step(0.01),
    location1: z.string().max(routeLimits.location1).nullable(),
    location2: z.string().max(routeLimits.location2).nullable(),
    defaultBothWays: z.boolean(),
    validFrom: z.string().date().nullable(),
    validTo: z.string().date().nullable(),
    schedule: z.number().int().min(0).max(255).nullable(), // BINARY type in SQL
    currencyCode: z.string().length(3),
    customConsumption: z.number().nonnegative().step(0.01).nullable(),
});
