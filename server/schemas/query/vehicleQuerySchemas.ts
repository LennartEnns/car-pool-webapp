import vehicleBaseSchema from "../base/vehicleBaseSchema";
import requireOneKey from "~/server/serverUtils/zodRequireExactlyOneKey";

export const vehicleIdQuerySchema = vehicleBaseSchema.pick({
    vehicleID: true
});

// Exactly one of the properties should be present
export const getVehicleQuerySchema = requireOneKey(vehicleBaseSchema
    .pick({
        vehicleID: true,
        userID: true,
    })
    .partial()
);
