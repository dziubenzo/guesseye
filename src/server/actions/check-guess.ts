'use server';

import { matchingComparisonResults } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action-client';
import type { CheckGuessAction } from '@/lib/types';
import {
  checkIfGuessCorrect,
  comparePlayers,
  fillAllMatches,
  validateScheduleId,
} from '@/lib/utils';
import { guessSchema } from '@/lib/zod/check-guess';
import { createGuess } from '@/server/db/create-guess';
import { endGame } from '@/server/db/end-game';
import { getGameAndPlayerToFind } from '@/server/db/get-game-and-player-to-find';
import { getPlayers } from '@/server/db/get-players';
import revalidateGameCache from '@/server/revalidators/revalidate-game-cache';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(
    async ({ parsedInput: { guess, scheduleId, currentMatches, mode } }) => {
      const validationResult = validateScheduleId(scheduleId);

      if ('error' in validationResult) {
        const error: CheckGuessAction = {
          type: 'error',
          error: validationResult.error,
        };
        return error;
      }

      const validScheduleId = validationResult.validScheduleId;

      const { playerMap } = await getPlayers();

      const guessedPlayer = playerMap.get(guess);

      if (!guessedPlayer) {
        const error: CheckGuessAction = {
          type: 'error',
          error: 'No darts player found. Try again.',
        };
        return error;
      }

      const gameAndPlayer = await getGameAndPlayerToFind(mode, validScheduleId);

      if ('error' in gameAndPlayer) {
        const error: CheckGuessAction = {
          type: 'error',
          error: gameAndPlayer.error,
        };
        return error;
      }

      const { game, playerToFind, isFirstGuess } = gameAndPlayer;

      // Add guess to DB
      const errorObject = await createGuess(game.id, guessedPlayer.id);

      if (errorObject) {
        const error: CheckGuessAction = {
          type: 'error',
          error: errorObject.error,
        };
        return error;
      }

      // Correct guess
      const isGuessCorrect = checkIfGuessCorrect(guessedPlayer, playerToFind);

      if (isGuessCorrect) {
        const errorObject = await endGame('win', game);

        if (errorObject) {
          const error: CheckGuessAction = {
            type: 'error',
            error: errorObject.error,
          };
          return error;
        }

        fillAllMatches(playerToFind, currentMatches);

        const data: CheckGuessAction = {
          type: 'success',
          success: {
            type: 'correctGuess',
            playerToFind,
            comparisonResults: matchingComparisonResults,
            newMatches: currentMatches,
          },
        };

        return data;
      }

      // Incorrect guess
      const { comparisonResults } = comparePlayers(
        guessedPlayer,
        playerToFind,
        currentMatches
      );

      // Refetch the game object on the game page if the first guess is incorrect
      if (isFirstGuess) {
        revalidateGameCache(mode, validScheduleId);
      }

      const data: CheckGuessAction = {
        type: 'success',
        success: {
          type: 'incorrectGuess',
          guessedPlayer,
          comparisonResults,
          newMatches: currentMatches,
        },
      };

      return data;
    }
  );
