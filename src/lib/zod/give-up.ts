import { z } from 'zod';

export const giveUpSchema = z.object({
  scheduleId: z.string().optional(),
  gameMode: z.union([z.literal('official'), z.literal('random')]),
});

export type GiveUpSchemaType = z.infer<typeof giveUpSchema>;
