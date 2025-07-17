'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { UpdateAction } from '@/lib/types';
import { schedulePlayerSchema } from '@/lib/zod/schedule-player';
import { db } from '@/server/db';
import { player, schedule } from '@/server/db/schema';
import { checkForAdmin } from '@/server/utils';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';

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

    const [scheduledPlayer] = await Promise.all([
      db.query.player.findFirst({
        where: eq(player.id, playerId),
        columns: { firstName: true, lastName: true },
      }),
      db.insert(schedule).values({ playerToFindId: playerId, startDate }),
    ]);

    if (!scheduledPlayer) {
      result = {
        type: 'error',
        message: `Failed to retrieve player with the id of ${playerId}.`,
      };
      return result;
    }

    const fullName = scheduledPlayer.firstName + ' ' + scheduledPlayer.lastName;

    result = {
      type: 'success',
      message: `${fullName} successfully scheduled for ${format(startDate, 'dd MMMM y')}.`,
    };

    return result;
  });
