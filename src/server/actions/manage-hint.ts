'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { manageHintSchema } from '@/lib/zod/manage-hint';
import { db } from '@/server/db';
import { hint as hintSchema } from '@/server/db/schema';
import { checkForAdmin } from '@/server/utils';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

export const manageHint = actionClient
  .schema(manageHintSchema)
  .action(async ({ parsedInput: { action, hintId, hint } }) => {
    let result: UpdateAction;

    const isAdmin = await checkForAdmin();

    if (!isAdmin) {
      result = {
        type: 'error',
        message: 'You are not authorised to perform this operation.',
      };
      return result;
    }

    if (action === 'edit') {
      await db
        .update(hintSchema)
        .set({ hint, isApproved: true })
        .where(eq(hintSchema.id, hintId));
      result = {
        type: 'success',
        message: 'Hint approved successfully.',
      };
    } else {
      await db.delete(hintSchema).where(eq(hintSchema.id, hintId));
      result = {
        type: 'success',
        message: 'Hint deleted successfully.',
      };
    }

    revalidatePath('/admin');
    revalidateTag('hintsCounts');

    return result;
  });
