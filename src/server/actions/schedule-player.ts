'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { schedulePlayerSchema } from '@/lib/zod/schedule-player';
import { db } from '@/server/db';
import { schedule } from '@/server/db/schema';
import { checkForAdmin } from '@/server/utils';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';

export const schedulePlayer = actionClient
  .schema(schedulePlayerSchema)
  .action(async ({ parsedInput: { playerId, startDate } }) => {
    let result: UpdateAction;

    const isAdmin = await checkForAdmin();

    if (!isAdmin) {
      result = {
        type: 'error',
        message: 'You are not authorised to perform this operation.',
      };
      return result;
    }

    await db.insert(schedule).values({ playerToFindId: playerId, startDate });

    result = {
      type: 'success',
      message: `successfully scheduled for ${format(startDate, 'dd MMMM y')}`,
    };

    revalidatePath('/admin');

    return result;
  });
