'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { Game, GameWithGuesses, GiveUpAction } from '@/lib/types';
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
        const error: GiveUpAction = { error: 'Invalid game.', success: false };
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
        error: scheduledPlayer.error,
        success: false,
      };
      return error;
    }

    // Get game if it exists
    const existingGame = await getGame(scheduledPlayer);

    const game: Game | GameWithGuesses = existingGame
      ? existingGame
      : await createGame(scheduledPlayer);

    const error = await endGame('giveUp', game);

    if (error) {
      return { ...error, success: false } as GiveUpAction;
    }

    return { success: true } as GiveUpAction;
  });
