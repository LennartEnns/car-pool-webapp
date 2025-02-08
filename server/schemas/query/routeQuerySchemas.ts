import routeBaseSchema from "../base/routeBaseSchema";
import { z } from 'zod';
import { uuidSchema } from "../valueSchemas";

export const routeIdQuerySchema = routeBaseSchema.pick({
    routeID: true,
});

export const getRouteQuerySchema =
    // Get one route by ID
    routeBaseSchema.pick({ routeID: true })
    .extend({ preview: z.string().optional() })

    // Get routes the current user is a passenger of
    // Always in preview mode
    .or(z.object({
        passenger: z.string(),
    }))

    // Get routes owned by userID (current user if not specified)
    // Always in preview mode
    .or(routeBaseSchema
        .pick({ userID: true })
        .partial()
    );

export const deleteRouteUserQuerySchema = z.object({
    userID: uuidSchema.optional(),
    routeID: uuidSchema,
});

export const updateRouteUserQuerySchema = deleteRouteUserQuerySchema;
