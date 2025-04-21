'use server';

import { forgetPassword } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import { sendResetEmailSchema } from '@/lib/zod/send-reset-email';

export const sendResetEmail = actionClient
  .schema(sendResetEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const { error } = await forgetPassword({
      email,
      redirectTo: '/reset-password',
    });

    if (error) return { error: error.message };

    return { success: true };
  });
