import { z } from 'zod';

export const addHintSchema = z.object({
  playerId: z.number({ message: 'No darts player chosen.' }),
  hint: z
    .string()
    .min(8, { message: 'Hint must be at least 8 characters long.' })
    .trim(),
  isApproved: z.boolean().default(false),
});

export type AddHintSchemaType = z.infer<typeof addHintSchema>;
