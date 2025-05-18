import { z } from 'zod';

export const giveUpSchema = z.object({
  scheduleId: z.string().optional(),
});

export type GiveUpSchemaType = z.infer<typeof giveUpSchema>;
