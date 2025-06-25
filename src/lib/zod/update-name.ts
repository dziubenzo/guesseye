import { z } from 'zod';

export const updateNameSchema = z.object({
  newName: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .max(16, { message: 'Name cannot exceed 16 characters.' })
    .trim(),
});

export type UpdateNameSchemaType = z.infer<typeof updateNameSchema>;
