'use server';

import { auth } from '@/lib/auth';
import type { GameDetails, GuessWithPlayer } from '@/lib/types';
import { comparePlayers } from '@/lib/utils';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { getIPAndUserAgent } from '../utils';

export const getOfficialGame = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const scheduledPlayer = await getScheduledPlayer();

  // TODO: Handle no player scheduled
  if (!scheduledPlayer) return null;

  let clientIP = '';
  let userAgent = '';

  if (!session) {
    const values = await getIPAndUserAgent();
    clientIP = values.clientIP;
    userAgent = values.userAgent;
  }

  // Check if game exist
  const existingGame = await db.query.game.findFirst({
    where: session
      ? and(
          eq(game.userId, session.user.id),
          eq(game.scheduledPlayerId, scheduledPlayer.id)
        )
      : and(
          eq(game.guestIp, clientIP),
          eq(game.guestUserAgent, userAgent),
          eq(game.scheduledPlayerId, scheduledPlayer.id)
        ),
    with: {
      guesses: {
        with: { player: true },
      },
    },
  });

  // TODO: Handle game not existing
  if (!existingGame) return null;

  // TODO: Handle game being over
  if (existingGame.hasWon) return null;

  // TODO: Handle game given up
  if (existingGame.hasGivenUp) return null;

  // Build comparison object for each guessed player
  const gameDetails: GameDetails = {
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
