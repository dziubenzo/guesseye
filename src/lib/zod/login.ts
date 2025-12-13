import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email.' }).trim(),
  password: z.string(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
