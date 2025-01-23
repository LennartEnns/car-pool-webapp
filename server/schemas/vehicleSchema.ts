import { z } from 'zod';
import { uuidSchema } from './valueSchemas';
import { vehicleLimits } from '~/limits';

const baseVehicleSchema = z.object({
    vehicleID: uuidSchema,
    name: z.string().max(vehicleLimits.name),
    model: z.string().max(vehicleLimits.model),
    description: z.string().max(vehicleLimits.description),
    consumption: z.number().nonnegative().step(0.01),
    electric: z.boolean(),
});

export const createVehicleSchema = baseVehicleSchema
    .partial({ // model and description have default values in the database
        model: true,
        description: true,
    });

export const updateVehicleSchema = baseVehicleSchema
    .partial() // Make everything optional
    .omit({ // vehicleID will be passed as query parameter
        vehicleID: true,
    });
