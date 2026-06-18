import { updateUser } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { updateVeryHardSchema } from '@/lib/zod/update-very-hard';

export const updateVeryHard = actionClient
  .schema(updateVeryHardSchema)
  .action(async ({ parsedInput: { newValue } }) => {
    let result: UpdateAction;

    // This also refreshes the cookie cache
    const updateResult = await updateUser({
      allowVeryHard: newValue,
    });

    if (updateResult.data?.status) {
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
