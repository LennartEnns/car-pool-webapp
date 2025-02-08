import vehicleBaseSchema from "../base/vehicleBaseSchema";
import { z } from "zod";

export const vehicleIdQuerySchema = vehicleBaseSchema.pick({
    vehicleID: true
});

export const getVehicleQuerySchema =
    // Get by vehicleID, preview mode optional
    vehicleBaseSchema
    .pick({ vehicleID: true })
    .extend({ preview: z.string().optional() })

    // Get by userID, always in preview mode
    .or(vehicleBaseSchema
        .pick({ userID: true })
        .partial()
    );
