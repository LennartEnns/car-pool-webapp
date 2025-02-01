import routeBaseSchema from "../base/routeBaseSchema";
import { z } from 'zod';
import { uuidSchema } from "../valueSchemas";

export const routeIdQuerySchema = routeBaseSchema.pick({
    routeID: true,
});

export const getRouteQuerySchema = routeBaseSchema
    .pick({
        routeID: true,
    })
    .or(routeBaseSchema
        .pick({
            userID: true,
        })
    );

export const deleteRouteUserQuerySchema = z.object({
    userID: uuidSchema.optional(),
    routeID: uuidSchema,
});

export const updateRouteUserQuerySchema = deleteRouteUserQuerySchema;
