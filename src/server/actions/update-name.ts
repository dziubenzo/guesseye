'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { updateNameSchema } from '@/lib/zod/update-name';
import { isNameTaken } from '@/server/utils';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export const updateName = actionClient
  .schema(updateNameSchema)
  .action(async ({ parsedInput: { newName } }) => {
    const nameTaken = await isNameTaken(newName);

    let result: UpdateAction;

    if (nameTaken) {
      result = {
        type: 'error',
        message: 'Name already taken.',
      };
      return result;
    }

    const { status } = await auth.api.updateUser({
      body: {
        name: newName,
      },
      headers: await headers(),
    });

    if (status) {
      result = {
        type: 'success',
        message: 'Name updated successfully!',
      };
      revalidatePath('/settings');
    } else {
      result = {
        type: 'error',
        message: 'Error while updating name. Please try again.',
      };
    }

    return result;
  });
