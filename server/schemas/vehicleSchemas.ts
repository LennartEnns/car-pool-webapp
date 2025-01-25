import { z } from 'zod';
import { uuidSchema } from './valueSchemas';
import { vehicleLimits } from '~/commonLimits';

const baseVehicleSchema = z.object({
    vehicleID: uuidSchema,
    userID: uuidSchema,
    name: z.string().max(vehicleLimits.name),
    model: z.string().max(vehicleLimits.model),
    description: z.string().max(vehicleLimits.description),
    consumption: z.number().nonnegative().step(0.01),
    electric: z.boolean(),
});

export const createVehicleSchema = baseVehicleSchema
    .partial({ // Have default values or are nullable
        vehicleID: true,
        model: true,
        description: true,
    })
    .omit({
        userID: true, // userID will be taken from event context
    });

export const updateVehicleSchema = baseVehicleSchema
    .partial() // Make everything optional
    .omit({
        vehicleID: true, // vehicleID will be passed as query parameter
        userID: true, // userID will be taken from event context
    });
