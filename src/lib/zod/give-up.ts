import { z } from 'zod';

export const giveUpSchema = z.object({
  hasGivenUp: z.boolean(),
});

export type GiveUpSchemaType = z.infer<typeof giveUpSchema>;
