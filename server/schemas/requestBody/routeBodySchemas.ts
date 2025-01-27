import zodRequireNonEmptyObject from "~/server/serverUtils/zodRequireNonEmptyObject";
import routeBaseSchema from "../base/routeBaseSchema";

export const createRouteSchema = routeBaseSchema
    .partial({ // Have default values or are nullable
        routeID: true,
        description: true,
        location1: true,
        location2: true,
        validFrom: true,
        validTo: true,
        schedule: true,
        customConsumption: true,
    })
    .omit({
        userID: true, // userID will be taken from event context
    });

export const updateRouteSchema = zodRequireNonEmptyObject(routeBaseSchema
    .partial() // Make everything optional
    .omit({
        routeID: true, // routeID will be passed as query parameter
        userID: true, // userID will be taken from event context
    })
);
