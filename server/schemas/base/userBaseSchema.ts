import { z } from "zod";
import { userLimits } from "~/commonLimits";

export default z.object({
    userID: z.string().uuid(),
    username: z.string().max(userLimits.username),
    pwHash: z.string().max(60),
    realName: z.string().max(userLimits.realName).nullable(),
});
