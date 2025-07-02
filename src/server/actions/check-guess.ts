'use server';

import { matchingComparisonResults } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action-client';
import type { CheckGuessAction } from '@/lib/types';
import {
  checkIfGuessCorrect,
  checkSearchResults,
  comparePlayers,
  fillAllMatches,
  filterPlayers,
  normaliseArray,
  validateScheduleId,
} from '@/lib/utils';
import { guessSchema } from '@/lib/zod/check-guess';
import { createGuess } from '@/server/db/create-guess';
import { endGame } from '@/server/db/end-game';
import { getGameAndPlayerToFind } from '@/server/db/get-game-and-player-to-find';
import { getPlayers } from '@/server/db/get-players';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(
    async ({
      parsedInput: { guess, scheduleId, playerToFindMatches, mode },
    }) => {
      const normalisedGuess = normaliseArray(guess);

      const validationResult = validateScheduleId(scheduleId);

      if ('error' in validationResult) {
        const error: CheckGuessAction = {
          type: 'error',
          error: validationResult.error,
        };
        return error;
      }

      const validScheduleId = validationResult.validScheduleId;

      const players = await getPlayers();

      const gameAndPlayer = await getGameAndPlayerToFind(mode, validScheduleId);

      if ('error' in gameAndPlayer) {
        const error: CheckGuessAction = {
          type: 'error',
          error: gameAndPlayer.error,
        };
        return error;
      }

      const { game, playerToFind } = gameAndPlayer;

      const searchResults = filterPlayers(players, normalisedGuess);

      const guessedPlayer = checkSearchResults(searchResults);

      if ('error' in guessedPlayer) {
        const error: CheckGuessAction = {
          type: 'error',
          error: guessedPlayer.error,
        };
        return error;
      }

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

        fillAllMatches(playerToFind, playerToFindMatches);

        const data: CheckGuessAction = {
          type: 'success',
          success: {
            type: 'correctGuess',
            playerToFind,
            comparisonResults: matchingComparisonResults,
            playerToFindMatches,
          },
        };

        return data;
      }

      // Incorrect guess
      const { comparisonResults } = comparePlayers(
        guessedPlayer,
        playerToFind,
        playerToFindMatches
      );

      const data: CheckGuessAction = {
        type: 'success',
        success: {
          type: 'incorrectGuess',
          guessedPlayer,
          comparisonResults,
          playerToFindMatches,
        },
      };

      return data;
    }
  );
