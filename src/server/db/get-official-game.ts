'use server';

import type { ExistingGame, GuessWithPlayer } from '@/lib/types';
import { comparePlayers } from '@/lib/utils';
import { getGameAndPlayer } from '@/server/db/get-game-and-player';

export const getOfficialGame = async () => {
  // Get scheduled player and existing game
  const { existingGame, scheduledPlayer } = await getGameAndPlayer();

  // Return error if no darts player is scheduled
  if (!scheduledPlayer) return { error: 'No scheduled player.' };

  // Return scheduled player difficulty only if there is no game in progress
  if (!existingGame) {
    return { playerDifficulty: scheduledPlayer.playerToFind.difficulty };
  }

  // TODO: Handle game being over
  if (existingGame.hasWon) return null;

  // TODO: Handle game given up
  if (existingGame.hasGivenUp) return null;

  // Build comparison object for each guessed player
  const gameDetails: ExistingGame = {
    guesses: [],
    playerToFindMatches: {},
    playerDifficulty: scheduledPlayer.playerToFind.difficulty,
  };

  existingGame.guesses.forEach((guess: GuessWithPlayer) => {
    const { comparisonResults, playerToFindMatches } = comparePlayers(
      guess.player,
      scheduledPlayer.playerToFind
    );
    gameDetails.guesses.push({
      guessedPlayer: guess.player,
      comparisonResults,
    });
    gameDetails.playerToFindMatches = playerToFindMatches;
  });

  return gameDetails;
};
