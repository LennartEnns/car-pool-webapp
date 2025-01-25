import { z } from 'zod';
import { uuidSchema } from './valueSchemas';
import { routeLimits } from '~/commonLimits';

const baseRouteSchema = z.object({
    routeID: uuidSchema,
    userID: uuidSchema,
    vehicleID: uuidSchema,
    name: z.string().max(routeLimits.name),
    description: z.string().max(routeLimits.description).optional(),
    distance: z.number().nonnegative().step(0.01),
    location1: z.string().max(routeLimits.location1).nullable().optional(), // NULL in DB if not present
    location2: z.string().max(routeLimits.location2).nullable().optional(),
    defaultBothWays: z.boolean(),
    validFrom: z.string().date().nullable(),
    validTo: z.string().date().nullable(),
    schedule: z.number().int().min(0).max(255), // BINARY type in SQL
    currencyCode: z.string().length(3),
    customConsumption: z.number().nonnegative().step(0.01).nullable().optional(),
});

export const createRouteSchema = baseRouteSchema
    .partial({ // Have default values or are nullable
        routeID: true,
        description: true,
        location1: true,
        location2: true,
        validFrom: true,
        validTo: true,
        schedule: true,
        customConsumption: true,
    })
    .omit({
        userID: true, // userID will be taken from event context
    });

export const updateRouteSchema = baseRouteSchema
    .partial() // Make everything optional
    .omit({
        routeID: true, // routeID will be passed as query parameter
        userID: true, // userID will be taken from event context
    });
