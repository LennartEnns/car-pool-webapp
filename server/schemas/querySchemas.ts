import { z } from "zod"
import { uuidSchema } from "./valueSchemas";
import { userLimits } from '~/commonLimits';

export const vehicleIdQuerySchema = z.object({
    vehicleID: uuidSchema,
});

export const userIdQuerySchema = z.object({
    userID: uuidSchema,
});
