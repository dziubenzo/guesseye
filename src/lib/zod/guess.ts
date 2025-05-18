import { z } from 'zod';

export const guessSchema = z.object({
  guess: z.string().min(3).max(64).trim(),
  scheduleId: z.string().optional(),
});

export type GuessSchemaType = z.infer<typeof guessSchema>;
