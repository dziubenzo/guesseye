'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { addHintSchema } from '@/lib/zod/add-hint';
import { db } from '@/server/db';
import { hint as hintSchema } from '@/server/db/schema';
import { checkForAdmin } from '@/server/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

export const addHint = actionClient
  .schema(addHintSchema)
  .action(async ({ parsedInput: { playerId, hint, isApproved } }) => {
    let result: UpdateAction;

    const isAdmin = await checkForAdmin();

    if (!isAdmin && isApproved) {
      result = {
        type: 'error',
        message: 'You are not authorised to perform this operation.',
      };
      return result;
    }

    await db.insert(hintSchema).values({
      playerId,
      hint,
      isApproved,
    });

    if (isApproved) {
      result = {
        type: 'success',
        message: `Hint successfully added for`,
      };
      revalidatePath('/admin');
    } else {
      result = {
        type: 'success',
        message: `Hint successfully submitted for review for`,
      };
      revalidateTag('suggestedHints');
    }

    return result;
  });
