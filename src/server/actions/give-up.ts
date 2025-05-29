'use server';

import { actionClient } from '@/lib/safe-action-client';
import type {
  Game,
  GameWithGuessesWithPlayer,
  GiveUpAction,
} from '@/lib/types';
import { isScheduleIdValid } from '@/lib/utils';
import { giveUpSchema } from '@/lib/zod/give-up';
import { createGame } from '@/server/db/create-game';
import { endGame } from '@/server/db/end-game';
import { getGame } from '@/server/db/get-game';
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
    const existingGame = await getGame(scheduledPlayer);

    const game: Game | GameWithGuessesWithPlayer = existingGame
      ? existingGame
      : await createGame(scheduledPlayer);

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
