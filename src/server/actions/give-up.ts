'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { GiveUpAction } from '@/lib/types';
import { validateScheduleId } from '@/lib/utils';
import { giveUpSchema } from '@/lib/zod/give-up';
import { endGame } from '@/server/db/end-game';
import { getGameAndPlayerToFind } from '@/server/db/get-game-and-player-to-find';

export const giveUp = actionClient
  .schema(giveUpSchema)
  .action(async ({ parsedInput: { scheduleId, mode } }) => {
    const validationResult = validateScheduleId(scheduleId);

    if ('error' in validationResult) {
      const error: GiveUpAction = {
        type: 'error',
        error: validationResult.error,
      };
      return error;
    }

    const validScheduleId = validationResult.validScheduleId;

    const gameAndPlayer = await getGameAndPlayerToFind(mode, validScheduleId);

    if ('error' in gameAndPlayer) {
      const error: GiveUpAction = {
        type: 'error',
        error: gameAndPlayer.error,
      };
      return error;
    }

    const { game, playerToFind } = gameAndPlayer;

    const errorObject = await endGame('giveUp', game);

    if (errorObject) {
      const error: GiveUpAction = {
        type: 'error',
        error: errorObject.error,
      };
      return error;
    }

    const fullName = playerToFind.firstName + ' ' + playerToFind.lastName;
    const success: GiveUpAction = {
      type: 'success',
      playerToFind: fullName,
    };

    return success;
  });
