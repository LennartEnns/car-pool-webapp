import rideBaseSchema from "../base/rideBaseSchema";
import { z } from 'zod';

export const rideIdQuerySchema = rideBaseSchema.pick({
    rideID: true,
});

export const getRideQuerySchema = rideBaseSchema
    .pick({
        rideID: true,
    })
    .or(rideBaseSchema
        .pick({
            routeID: true,
        })
        .extend({
            minArrivalDatetime: z.string().datetime(),
        })
    );
