'use server';

import { actionClient } from '@/lib/safe-action-client';
import type { RevealHintAction } from '@/lib/types';
import { revealHintSchema } from '@/lib/zod/reveal-hint';
import { db } from '@/server/db';
import { game, hint } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, eq } from 'drizzle-orm';

export const revealHint = actionClient
  .schema(revealHintSchema)
  .action(async ({ parsedInput: { gameId } }) => {
    let result: RevealHintAction;

    const { session, clientIP, clientUserAgent } = await getUserOrGuest();

    // Make sure gameId is the right one
    const currentGame = await db.query.game.findFirst({
      where: session
        ? and(eq(game.userId, session.user.id), eq(game.id, gameId))
        : and(
            eq(game.guestIp, clientIP),
            eq(game.guestUserAgent, clientUserAgent),
            eq(game.id, gameId)
          ),
      with: {
        scheduledPlayer: {
          columns: {
            playerToFindId: true,
          },
        },
      },
    });

    if (!currentGame) {
      result = { type: 'error', error: 'Hint reveal failed.' };
      return result;
    }

    // Get player id
    const playerId =
      currentGame.scheduledPlayer?.playerToFindId || currentGame.randomPlayerId;

    if (!playerId) {
      result = { type: 'error', error: 'Hint reveal failed.' };
      return result;
    }

    // Get the revealed hint optimistically
    const [revealedHint] = await Promise.all([
      db.query.hint.findFirst({
        columns: { createdAt: true, hint: true },
        where: and(eq(hint.playerId, playerId), eq(hint.isApproved, true)),
        offset: currentGame.hintsRevealed,
      }),
      db
        .update(game)
        .set({ hintsRevealed: currentGame.hintsRevealed + 1 })
        .where(eq(game.id, gameId)),
    ]);

    // Revert the increment of the hintsRevealed field if no revealed hint is retrieved, meaning that the hintsRevealed field is greater than the hints count for the player
    if (!revealedHint) {
      await db
        .update(game)
        .set({ hintsRevealed: currentGame.hintsRevealed - 1 })
        .where(eq(game.id, gameId));
      result = { type: 'error', error: 'There are no more hints to reveal.' };
      return result;
    }

    result = {
      type: 'success',
      revealedHint,
    };

    return result;
  });
