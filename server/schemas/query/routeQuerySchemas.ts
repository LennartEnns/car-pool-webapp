import routeBaseSchema from "../base/routeBaseSchema";
import requireOneKey from "~/server/serverUtils/zodRequireExactlyOneKey";

export const routeIdQuerySchema = routeBaseSchema.pick({
    routeID: true,
});

// Exactly one of the properties should be present
export const getRouteQuerySchema = requireOneKey(routeBaseSchema
    .pick({
        routeID: true,
        userID: true,
    })
    .partial()
);
