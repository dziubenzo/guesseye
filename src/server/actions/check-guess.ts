'use server';

import { actionClient } from '@/lib/safe-action-client';
import { guessSchema } from '@/lib/zod/guess';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(async ({ parsedInput: { guess } }) => {
    const error = { message: guess };

    if (error) return { error: error.message };

    return { success: true };
  });
