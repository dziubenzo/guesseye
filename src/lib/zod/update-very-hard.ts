import { z } from 'zod';

export const updateVeryHardSchema = z.object({
  newValue: z.boolean(),
});

export type UpdateVeryHardSchemaType = z.infer<typeof updateVeryHardSchema>;
