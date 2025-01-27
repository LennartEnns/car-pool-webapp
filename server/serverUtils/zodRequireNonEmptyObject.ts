import { ZodObject } from 'zod';

export default<T extends ZodObject<any>> (schema: T): T => {
    return schema.refine(
        (obj) => {
            // Check if at least one key has a non-undefined value
            return Object.values(obj).some((value) => value !== undefined);
        },
        {
            message: "Exactly one of the keys must be present",
        }
    ) as unknown as T;
}
