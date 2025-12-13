import { z } from 'zod';

export const sendResetEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email.' }),
});

export type SendResetEmailSchemaType = z.infer<typeof sendResetEmailSchema>;
