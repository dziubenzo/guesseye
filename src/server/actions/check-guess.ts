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
  isScheduleIdValid,
  normaliseGuess,
} from '@/lib/utils';
import { guessSchema } from '@/lib/zod/guess';
import { createGuess } from '@/server/db/create-guess';
import { createOfficialGame } from '@/server/db/create-official-game';
import { endGame } from '@/server/db/end-game';
import { findOfficialGame } from '@/server/db/find-official-game';
import { getPlayers } from '@/server/db/get-players';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(
    async ({ parsedInput: { guess, scheduleId, playerToFindMatches } }) => {
      const normalisedGuess = normaliseGuess(guess);

      if (scheduleId) {
        // Make sure scheduleId is a positive integer
        const isValid = isScheduleIdValid(scheduleId);

        if (!isValid) {
          const error: CheckGuessAction = {
            type: 'error',
            error: 'Invalid game.',
          };
          return error;
        }
      }

      const validScheduleId = Number(scheduleId);

      const players = await getPlayers();

      // Get scheduled player
      const scheduledPlayer = await getScheduledPlayer(
        validScheduleId ? validScheduleId : undefined
      );

      if ('error' in scheduledPlayer) {
        const error: CheckGuessAction = {
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

      const { playerToFind } = scheduledPlayer;

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
