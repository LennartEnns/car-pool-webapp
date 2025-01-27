import baseUserSchema from "../base/userBaseSchema";
import { z } from 'zod';
import zodRequireNonEmptyObject from "~/server/serverUtils/zodRequireNonEmptyObject";

export const registrationBodySchema = baseUserSchema
    .omit({ // Will be determined on user creation
        userID: true,
        pwHash: true,
    })
    .extend({
        password: z.string(),
    })
    .partial({ // Have default values or are nullable
        realName: true,
    });

export const updateUserSchema = zodRequireNonEmptyObject(
    baseUserSchema
    .omit({
        userID: true, // userID will be taken from event context
        pwHash: true,
    })
    .extend({
        password: z.string(), // New password
    })
    .partial() // Make everything optional
);
