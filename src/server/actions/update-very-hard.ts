'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { updateVeryHardSchema } from '@/lib/zod/update-very-hard';
import { headers } from 'next/headers';

export const updateVeryHard = actionClient
  .schema(updateVeryHardSchema)
  .action(async ({ parsedInput: { newValue } }) => {
    let result: UpdateAction;

    const { status } = await auth.api.updateUser({
      body: {
        allowVeryHard: newValue,
      },
      headers: await headers(),
    });

    if (status) {
      result = {
        type: 'success',
        message: 'Setting updated successfully!',
      };
    } else {
      result = {
        type: 'error',
        message: 'Error while updating the Setting. Please try again.',
      };
    }

    return result;
  });
