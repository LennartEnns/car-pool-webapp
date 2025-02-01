import vehicleBaseSchema from "../base/vehicleBaseSchema";

export const vehicleIdQuerySchema = vehicleBaseSchema.pick({
    vehicleID: true
});

export const getVehicleQuerySchema = vehicleBaseSchema
    .pick({
        vehicleID: true,
    })
    .or(vehicleBaseSchema
        .pick({
            userID: true,
        })
        .partial()
    );
