'use server';

import { matchingComparisonResults } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action-client';
import type {
  CheckGuessAction,
  ErrorObject,
  Game,
  OfficialGame,
  Player,
  RandomGame,
  ScheduleWithPlayer,
} from '@/lib/types';
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
import { createRandomGame } from '@/server/db/create-random-game';
import { endGame } from '@/server/db/end-game';
import { findOfficialGame } from '@/server/db/find-official-game';
import { findRandomGame } from '@/server/db/find-random-game';
import { getPlayers } from '@/server/db/get-players';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(
    async ({
      parsedInput: { guess, scheduleId, playerToFindMatches, gameMode },
    }) => {
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

      let scheduledPlayer: ScheduleWithPlayer | ErrorObject;
      let game: OfficialGame | RandomGame | Game | ErrorObject;
      let playerToFind: Player;

      if (gameMode === 'official') {
        scheduledPlayer = await getScheduledPlayer(
          validScheduleId ? validScheduleId : undefined
        );

        if ('error' in scheduledPlayer) {
          const error: CheckGuessAction = {
            type: 'error',
            error: scheduledPlayer.error,
          };
          return error;
        }

        const existingGame = await findOfficialGame(scheduledPlayer);

        game = existingGame
          ? existingGame
          : await createOfficialGame(scheduledPlayer);

        playerToFind = scheduledPlayer.playerToFind;
      } else {
        const existingGame = await findRandomGame();

        game = existingGame ? existingGame : await createRandomGame();

        if ('error' in game) {
          const error: CheckGuessAction = {
            type: 'error',
            error: game.error,
          };
          return error;
        }

        if ('randomPlayer' in game && game.randomPlayer) {
          playerToFind = game.randomPlayer;
        } else {
          const error: CheckGuessAction = {
            type: 'error',
            error: 'No player to find found.',
          };
          return error;
        }
      }

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
