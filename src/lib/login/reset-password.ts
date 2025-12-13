import { resetPassword } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import { resetPasswordSchema } from '@/lib/zod/reset-password';

export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: { newPassword, token } }) => {
    if (!token) {
      return { error: 'Invalid token' };
    }

    const { error } = await resetPassword({
      newPassword,
      token,
    });

    if (error) return { error: error.message };

    return { success: true };
  });
