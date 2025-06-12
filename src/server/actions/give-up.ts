'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { GiveUpAction } from '@/lib/types';
import { isScheduleIdValid } from '@/lib/utils';
import { giveUpSchema } from '@/lib/zod/give-up';
import { createOfficialGame } from '@/server/db/create-official-game';
import { endGame } from '@/server/db/end-game';
import { findOfficialGame } from '@/server/db/find-official-game';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';

export const giveUp = actionClient
  .schema(giveUpSchema)
  .action(async ({ parsedInput: { scheduleId } }) => {
    if (scheduleId) {
      // Make sure scheduleId is a positive integer
      const isValid = isScheduleIdValid(scheduleId);

      if (!isValid) {
        const error: GiveUpAction = { type: 'error', error: 'Invalid game.' };
        return error;
      }
    }

    const validScheduleId = Number(scheduleId);

    // Get scheduled player
    const scheduledPlayer = await getScheduledPlayer(
      validScheduleId ? validScheduleId : undefined
    );

    if ('error' in scheduledPlayer) {
      const error: GiveUpAction = {
        type: 'error',
        error: scheduledPlayer.error,
      };
      return error;
    }

    // Get game if it exists
    const existingGame = await findOfficialGame(scheduledPlayer);

    const game = existingGame
      ? existingGame
      : await createOfficialGame(scheduledPlayer);

    const errorObject = await endGame('giveUp', game);

    if (errorObject) {
      const error: GiveUpAction = {
        type: 'error',
        error: errorObject.error,
      };
      return error;
    }

    const success: GiveUpAction = { type: 'success' };
    return success;
  });
