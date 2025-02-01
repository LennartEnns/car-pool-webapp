import userBaseSchema from "../base/userBaseSchema";
import { userLimits } from "~/commonLimits";
import { z } from 'zod';
import { uuidSchema } from "../valueSchemas";

export const userIdQuerySchema = userBaseSchema.pick({
    userID: true,
});

export const getUserQuerySchema = z.object({
    userID: uuidSchema.optional(),
});

export const searchUserQuerySchema = userBaseSchema
    .pick({
        username: true,
    })
    .or(z.object({
            realName: z.string().max(userLimits.realName),
        })
    );
