'use server';

import type {
  ErrorObject,
  ExistingGame,
  GuessWithPlayer,
  NoGame,
} from '@/lib/types';
import { comparePlayers } from '@/lib/utils';
import { getGameAndPlayer } from '@/server/db/get-game-and-player';
import { handleGameGivenUp } from '@/server/db/handle-game-given-up';
import { handleGameWon } from '@/server/db/handle-game-won';

export const getOfficialGame = async () => {
  // Get scheduled player and existing game
  const { existingGame, scheduledPlayer } = await getGameAndPlayer();

  // Return error if no darts player is scheduled
  if (!scheduledPlayer) {
    const error: ErrorObject = { error: 'No scheduled darts player.' };
    return error;
  }

  // Return only scheduled player difficulty if there is no game in progress
  if (!existingGame) {
    const playerDifficulty: NoGame = {
      noGame: true,
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
    };
    return playerDifficulty;
  }

  if (existingGame.hasWon) {
    const data = await handleGameWon(scheduledPlayer, existingGame);
    return data;
  }

  if (existingGame.hasGivenUp) {
    const data = await handleGameGivenUp(scheduledPlayer, existingGame);
    return data;
  }

  const gameDetails: ExistingGame = {
    gameInProgress: true,
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
