'use server';

import { actionClient } from '@/lib/safe-action-client';
import { resetPasswordSchema } from '@/lib/zod/reset-password';

export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: { newPassword, token } }) => {
    return { success: 'yay!', error: 'Placeholder error' };
  });
