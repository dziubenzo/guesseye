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
      const fullName =
        player.firstName.toLowerCase() + ' ' + player.lastName.toLowerCase();
      return fullName.includes(normalisedGuess);
    });

    let guessedPlayer;

    if (searchResults.length === 0) {
      return { error: 'No darts player found. Try again.' } as CheckGuessAction;
    } else if (searchResults.length > 1) {
      // Handle searchResult.length > 1 better, e.g. Smiths
      return {
        error:
          'More than one darts player found. Please add more detail to your guess.',
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
