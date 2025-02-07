import routeBaseSchema from "../base/routeBaseSchema";
import { z } from 'zod';
import { uuidSchema } from "../valueSchemas";

export const routeIdQuerySchema = routeBaseSchema.pick({
    routeID: true,
});

export const getRouteQuerySchema = (routeBaseSchema
    .pick({ routeID: true })
    .extend({ preview: z.string().optional() })
    .or(routeBaseSchema
        .pick({ userID: true })
        .extend({ preview: z.string() })
        .partial()
    ));

export const deleteRouteUserQuerySchema = z.object({
    userID: uuidSchema.optional(),
    routeID: uuidSchema,
});

export const updateRouteUserQuerySchema = deleteRouteUserQuerySchema;
