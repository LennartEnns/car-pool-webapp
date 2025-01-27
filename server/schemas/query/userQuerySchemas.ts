import userBaseSchema from "../base/userBaseSchema";
import requireOneKey from "~/server/serverUtils/zodRequireExactlyOneKey";

export const userIdQuerySchema = userBaseSchema.pick({
    userID: true,
});

export const searchUserQuerySchema = requireOneKey(
    userBaseSchema.pick({
        username: true,
        realName: true,
    })
    .partial()
);
