import { z } from "zod";
import { userLimits } from "~/commonLimits";

const baseUserSchema = z.object({
    userID: z.string().uuid(),
    username: z.string().max(userLimits.username),
    pwHash: z.string().max(60),
    realName: z.string().max(userLimits.realName).optional(),
});

export const registrationBodySchema = baseUserSchema.omit({
    userID: true,
    pwHash: true,
}).extend({
    password: z.string(),
});
