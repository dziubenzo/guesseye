'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { Game, GameWithGuesses, GiveUpAction } from '@/lib/types';
import { giveUpSchema } from '@/lib/zod/give-up';
import { createGame } from '@/server/db/create-game';
import { endGame } from '@/server/db/end-game';
import { getGameAndPlayer } from '@/server/db/get-game-and-player';

export const giveUp = actionClient
  .schema(giveUpSchema)
  .action(async ({ parsedInput: { hasGivenUp } }) => {
    if (!hasGivenUp) {
      return {
        error: 'An unexpected error occurred.',
        success: false,
      } as GiveUpAction;
    }

    const { existingGame, scheduledPlayer } = await getGameAndPlayer();

    if (!scheduledPlayer) {
      return {
        error: 'There was an error retrieving scheduled player.',
        success: false,
      } as GiveUpAction;
    }

    const game: Game | GameWithGuesses = existingGame
      ? existingGame
      : await createGame(scheduledPlayer);

    const error = await endGame('giveUp', game);

    if (error) {
      return { ...error, success: false } as GiveUpAction;
    }

    return { success: true } as GiveUpAction;
  });
