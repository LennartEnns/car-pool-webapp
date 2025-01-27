import routeBaseSchema from "../base/routeBaseSchema";

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
