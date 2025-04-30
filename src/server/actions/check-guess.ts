'use server';

import { actionClient } from '@/lib/safe-action-client';
import { CheckGuessAction, Player } from '@/lib/types';
import {
  checkIfGuessCorrect,
  comparePlayers,
  normaliseGuess,
} from '@/lib/utils';
import { guessSchema } from '@/lib/zod/guess';
import { getPlayers } from '@/server/db/get-players';

export const checkGuess = actionClient
  .schema(guessSchema)
  .action(async ({ parsedInput: { guess } }) => {
    const normalisedGuess = normaliseGuess(guess);

    // Handle case where current guess is one of the previous guesses
    const players = await getPlayers();
    const [playerToFind]: Player[] = players.filter(
      (player) => player.lastName === 'Ratajski'
    );

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
      return { error: 'No darts player found. Try again.' } as CheckGuessAction;
    } else if (searchResults.length === 2) {
      const playerNames = searchResults
        .map((player) => {
          return player.firstName + ' ' + player.lastName;
        })
        .join(' and ');
      return {
        error: `Found two players: ${playerNames}. Please add more detail to your guess.`,
      } as CheckGuessAction;
    } else if (searchResults.length > 2) {
      return {
        error:
          'Found more than two darts players. Please add more detail to your guess.',
      } as CheckGuessAction;
    } else {
      guessedPlayer = searchResults[0];
    }

    // Correct guess
    const isGuessCorrect = checkIfGuessCorrect(guessedPlayer, playerToFind);

    if (isGuessCorrect) {
      return {
        success: { type: 'correctGuess', playerToFind },
      } as CheckGuessAction;
    }

    // Incorrect guess
    const { comparisonResults, playerToFindMatches } = comparePlayers(
      guessedPlayer,
      playerToFind
    );

    // Send difficulty to frontend
    playerToFindMatches.difficulty = playerToFind.difficulty;

    return {
      success: {
        type: 'incorrectGuess',
        guessedPlayer,
        comparisonResults,
        playerToFindMatches,
      },
    } as CheckGuessAction;
  });
