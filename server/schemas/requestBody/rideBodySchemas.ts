import zodRequireNonEmptyObject from "~/server/serverUtils/zodRequireNonEmptyObject";
import rideBaseSchema from "../base/rideBaseSchema";

export const createRideSchema = rideBaseSchema
    .partial({ // Have default values or are nullable
        rideID: true,
        startDatetime: true,
        customDistance: true,
        customBothWays: true,
        reverseDirection: true,
    });

export const updateRideSchema = zodRequireNonEmptyObject(rideBaseSchema
    .partial() // Make everything optional
    .omit({
        rideID: true, // rideID will be passed as query parameter
        routeID: true, // routeID should never be updated for a ride
    })
);
