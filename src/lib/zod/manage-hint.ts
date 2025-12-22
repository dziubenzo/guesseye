import { z } from 'zod';

export const manageHintSchema = z.object({
  action: z.union([z.literal('edit'), z.literal('delete')]),
  hintId: z
    .number()
    .int({ message: 'hintId must be an integer.' })
    .positive({ message: 'hintId must be positive.' }),
  hint: z
    .string()
    .min(8, { message: 'Hint must be at least 8 characters long.' })
    .trim(),
});

export type ManageHintSchemaType = z.infer<typeof manageHintSchema>;
