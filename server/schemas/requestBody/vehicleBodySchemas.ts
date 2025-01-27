import baseVehicleSchema from "../base/vehicleBaseSchema";
import zodRequireNonEmptyObject from "~/server/serverUtils/zodRequireNonEmptyObject";

export const createVehicleSchema = baseVehicleSchema
    .omit({
        userID: true, // userID will be taken from event context
    })
    .partial({ // Have default values or are nullable
        vehicleID: true,
        model: true,
        description: true,
    });

export const updateVehicleSchema = zodRequireNonEmptyObject(
    baseVehicleSchema
    .omit({
        vehicleID: true, // vehicleID will be passed as query parameter
        userID: true, // userID will be taken from event context
    })
    .partial() // Make everything optional
);
