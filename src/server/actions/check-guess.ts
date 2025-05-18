'use server';

import { matchingComparisonResults } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action-client';
import type { CheckGuessAction, Game, GameWithGuesses } from '@/lib/types';
import {
  checkIfGuessCorrect,
  comparePlayers,
  isScheduleIdValid,
  normaliseGuess,
} from '@/lib/utils';
import { guessSchema } from '@/lib/zod/guess';
import { createGame } from '@/server/db/create-game';
import { createGuess } from '@/server/db/create-guess';
import { endGame } from '@/server/db/end-game';
import { getGame } from '@/server/db/get-game';
import { getPlayers } from '@/server/db/get-players';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(async ({ parsedInput: { guess, scheduleId } }) => {
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
    const existingGame = await getGame(scheduledPlayer);

    const game: Game | GameWithGuesses = existingGame
      ? existingGame
      : await createGame(scheduledPlayer);

    const { playerToFind } = scheduledPlayer;

    const searchResults = players.filter((player) => {
      const firstName = player.firstName.toLowerCase();
      const lastName = player.lastName.toLowerCase();
      if (normalisedGuess.length === 1) {
        return (
          firstName.includes(normalisedGuess[0]) ||
          lastName.includes(normalisedGuess[0])
        );
      }
      return (
        firstName.includes(normalisedGuess[0]) &&
        lastName.includes(normalisedGuess[1])
      );
    });

    let guessedPlayer;

    if (searchResults.length === 0) {
      const error: CheckGuessAction = {
        type: 'error',
        error: 'No darts player found. Try again.',
      };
      return error;
    } else if (searchResults.length === 2) {
      const playerNames = searchResults
        .map((player) => {
          return player.firstName + ' ' + player.lastName;
        })
        .join(' and ');
      const error: CheckGuessAction = {
        type: 'error',
        error: `Found two players: ${playerNames}. Please add more detail to your guess.`,
      };
      return error;
    } else if (searchResults.length > 2) {
      const error: CheckGuessAction = {
        type: 'error',
        error:
          'Found more than two darts players. Please add more detail to your guess.',
      };
      return error;
    } else {
      guessedPlayer = searchResults[0];
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

      const data: CheckGuessAction = {
        type: 'success',
        success: {
          type: 'correctGuess',
          playerToFind,
          comparisonResults: matchingComparisonResults,
        },
      };

      return data;
    }

    // Incorrect guess
    const { comparisonResults, playerToFindMatches } = comparePlayers(
      guessedPlayer,
      playerToFind
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
  });
