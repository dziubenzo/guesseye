import { z } from 'zod';

export const revealHintSchema = z.object({
  gameId: z
    .number()
    .int({ message: 'Invalid parameter.' })
    .positive({ message: 'Invalid parameter.' }),
});

export type RevealHintSchemaType = z.infer<typeof revealHintSchema>;
