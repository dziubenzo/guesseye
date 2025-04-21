import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password cannot exceed 32 characters.' }),
    confirmNewPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
