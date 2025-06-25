import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long.' })
      .max(16, { message: 'Name cannot exceed 16 characters.' })
      .trim(),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password cannot exceed 32 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;
