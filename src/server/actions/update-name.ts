import { updateUser } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { updateNameSchema } from '@/lib/zod/update-name';
import revalidateLeaderboardCache from '@/server/revalidators/revalidate-leaderboard-cache';
import { isNameTaken } from '@/server/utils';

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

    // This also refreshes the cookie cache
    const updateResult = await updateUser({
      name: newName,
    });

    if (updateResult.data?.status) {
      result = {
        type: 'success',
        message: 'Name updated successfully!',
      };
      await revalidateLeaderboardCache();
    } else {
      result = {
        type: 'error',
        message: 'Error while updating name. Please try again.',
      };
    }

    return result;
  });
