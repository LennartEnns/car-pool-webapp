import { z } from 'zod';
import { uuidSchema } from './valueSchemas';

const baseVehicleSchema = z.object({
    vehicleID: uuidSchema,
    name: z.string().max(40),
    model: z.string().max(40),
    description: z.string().max(255),
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
