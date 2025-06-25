'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action-client';
import type { UpdateNameAction } from '@/lib/types';
import { updateNameSchema } from '@/lib/zod/update-name';
import { isNameTaken } from '@/server/utils';
import { headers } from 'next/headers';

export const updateName = actionClient
  .schema(updateNameSchema)
  .action(async ({ parsedInput: { newName } }) => {
    const nameTaken = await isNameTaken(newName);

    let result: UpdateNameAction;

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
    } else {
      result = {
        type: 'error',
        message: 'Error while updating name. Please try again.',
      };
    }

    return result;
  });
