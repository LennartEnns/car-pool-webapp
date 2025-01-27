import { ZodObject } from 'zod';

export default<T extends ZodObject<any>> (schema: T): T => {
    return schema.refine(
        (obj) => {
            const values = Object.values(obj).filter((val) => val !== undefined);
            return values.length === 1;
        },
        {
            message: "Exactly one of the keys must be present",
        }
    ) as unknown as T;
}
