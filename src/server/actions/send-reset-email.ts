'use server';

import { actionClient } from '@/lib/safe-action-client';
import { sendResetEmailSchema } from '@/lib/zod/send-reset-email';

export const sendResetEmail = actionClient
  .schema(sendResetEmailSchema)
  .action(async ({ parsedInput: { email } }) => {
    return { error: 'Placeholder error' };
  });
