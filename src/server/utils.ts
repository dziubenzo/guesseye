'use server';

import { auth } from '@/lib/auth';
import { MISSING_PLAYERS_MAX_RANKING } from '@/lib/constants';
import type {
  ErrorObject,
  RankedPlayer,
  TourCardHolder,
  UpdateRankingsType,
} from '@/lib/types';
import {
  getPlayerCondition,
  getRankingType,
  handleDifferentSpellings,
  normaliseToString,
} from '@/lib/utils';
import { browser } from '@/server/browser';
import { db } from '@/server/db';
import { playersMap, playersNormalisedMap } from '@/server/db/get-players-map';
import { lower, player as playerSchema, user } from '@/server/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function getIPAndUserAgent() {
  const headersList = await headers();
  const clientUserAgent = headersList.get('User-Agent') || '';
  const clientIP = (headersList.get('X-Forwarded-For') || '')
    .split(',')[0]
    .trim();

  return { clientIP, clientUserAgent };
}

export async function getUserOrGuest() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return { session, clientIP: null, clientUserAgent: null };
  } else {
    const { clientIP, clientUserAgent } = await getIPAndUserAgent();
    return { session: null, clientIP, clientUserAgent };
  }
}

export async function checkForAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user.role === 'admin';
}

export async function isNameTaken(newName: string) {
  const nameTaken = await db.query.user.findFirst({
    where: eq(lower(user.name), newName.toLowerCase()),
  });

  return nameTaken ? true : false;
}

// Get PDC Order of Merits or Elo rankings
export async function getPDCOrEloRankings(
  url: string,
  rankingsSelector: string,
  fullNamesSelector: string
) {
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  const rankedPlayers: RankedPlayer[] = [];

  // Get current rankings and full names from the selector
  const [rankings, fullNames] = await Promise.all([
    page.$$eval(rankingsSelector, (rankingTds) => {
      return rankingTds.map((rankingTd) => rankingTd.textContent);
    }),
    page.$$eval(fullNamesSelector, (fullNameTds) => {
      return fullNameTds.map((fullNameTd) => fullNameTd.textContent);
    }),
  ]);

  if (rankings.length !== fullNames.length) {
    const error: ErrorObject = { error: 'Array lengths do not match.' };
    return error;
  }

  // Build the object
  for (let i = 0; i < rankings.length; i++) {
    const currentRanking = rankings[i];
    const currentFullName = fullNames[i];

    if (currentRanking === null || currentFullName === null) {
      const error: ErrorObject = {
        error: 'Ranking or full name array item is empty.',
      };
      return error;
    }

    const rankingNumber = parseInt(currentRanking);

    if (Number.isNaN(rankingNumber)) {
      const error: ErrorObject = {
        error: 'Ranking is not a number.',
      };
      return error;
    }

    const fullName = handleDifferentSpellings(currentFullName.trim());

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    rankedPlayers.push({
      ranking: rankingNumber,
      firstName,
      lastName,
    });
  }

  return rankedPlayers;
}

// Get WDF Order of Merits
export async function getWDFRankings(
  url: string,
  rankingsSelector: string,
  fullNamesSelector: string,
  limit: number
) {
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  const rankedPlayers: RankedPlayer[] = [];

  // Get current rankings and full names from the selector, applying the limit
  const [rankings, fullNames] = await Promise.all([
    page.$$eval(
      rankingsSelector,
      (rankingSpans, limit) => {
        return rankingSpans
          .slice(0, limit)
          .map((rankingSpan) => rankingSpan.textContent);
      },
      limit
    ),
    page.$$eval(
      fullNamesSelector,
      (fullNameSpans, limit) => {
        return fullNameSpans
          .slice(0, limit)
          .map((fullNameSpan) => fullNameSpan.textContent);
      },
      limit
    ),
  ]);

  if (rankings.length !== fullNames.length) {
    const error: ErrorObject = { error: 'Array lengths do not match.' };
    return error;
  }

  // Build the object
  for (let i = 0; i < rankings.length; i++) {
    const currentRanking = rankings[i];
    const currentFullName = fullNames[i];

    if (currentRanking === null || currentFullName === null) {
      const error: ErrorObject = {
        error: 'Ranking or full name array item is empty.',
      };
      return error;
    }

    // Get rid of the dot at the end
    const rankingNoDot = currentRanking.split('.')[0];

    const rankingNumber = parseInt(rankingNoDot);

    if (Number.isNaN(rankingNumber)) {
      const error: ErrorObject = {
        error: 'Ranking is not a number.',
      };
      return error;
    }

    const fullName = handleDifferentSpellings(currentFullName.trim());

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    rankedPlayers.push({
      ranking: rankingNumber,
      firstName,
      lastName,
    });
  }

  return rankedPlayers;
}

export async function updateDBRankings(
  type: UpdateRankingsType,
  rankedPlayers: RankedPlayer[]
) {
  const playerCondition = getPlayerCondition(type);

  const rankingType = getRankingType(type);

  // Set ranking value to null for darts players
  await db
    .update(playerSchema)
    .set({ [rankingType]: null })
    .where(and(isNotNull(playerSchema[rankingType]), playerCondition));

  let updateCount = 0;
  const missingPlayers: string[] = [];

  for (const rankedPlayer of rankedPlayers) {
    const normalisedFullName =
      normaliseToString(rankedPlayer.firstName) +
      ' ' +
      normaliseToString(rankedPlayer.lastName);

    // Update the ranking of a darts player if they are in the players map (DB)
    if (playersNormalisedMap.has(normalisedFullName)) {
      const player = playersNormalisedMap.get(normalisedFullName)!;
      await db
        .update(playerSchema)
        .set({ [rankingType]: rankedPlayer.ranking })
        .where(
          and(
            eq(playerSchema.firstName, player.firstName),
            eq(playerSchema.lastName, player.lastName)
          )
        );
      updateCount++;
    } else {
      // Identify players who are not in the DB
      // Return only missing players ranked up to and including MISSING_PLAYERS_MAX_RANKING for both WDF rankings and the PDC Women ranking
      // Return all missing players for PDC Men and Elo rankings
      const ranking = rankedPlayer.ranking;

      if (
        ((type === 'womenPDC' || type === 'menWDF' || type === 'womenWDF') &&
          ranking <= MISSING_PLAYERS_MAX_RANKING) ||
        type === 'menPDC' ||
        type === 'elo'
      ) {
        const fullName = rankedPlayer.firstName + ' ' + rankedPlayer.lastName;
        missingPlayers.push(`${fullName} (${ranking})`);
      }
    }
  }

  return { updateCount, playersDB: playersMap.size, missingPlayers };
}

// Get current Tour Card Holders
export async function getTourCardHolders() {
  const page = await browser.newPage();

  const currentYear = new Date().getFullYear();

  await page.goto(
    `https://en.wikipedia.org/wiki/List_of_players_with_a_${currentYear}_PDC_Tour_Card`
  );

  await page.setViewport({ width: 1080, height: 1024 });

  const tourCardHolders: TourCardHolder[] = [];

  // Get full names
  const fullNames = await page.$$eval(
    'tr td:nth-child(3) a',
    (fullNameSpans) => {
      return fullNameSpans.map((fullNameSpan) => fullNameSpan.textContent);
    }
  );

  // Make sure there are exactly 128 TC holders
  if (fullNames.length !== 128) {
    const error: ErrorObject = { error: 'Array length is not 128.' };
    return error;
  }

  // Build the object
  for (let i = 0; i < fullNames.length; i++) {
    const currentFullName = fullNames[i];

    if (currentFullName === null) {
      const error: ErrorObject = {
        error: 'Full name array item is empty.',
      };
      return error;
    }

    const fullName = handleDifferentSpellings(currentFullName.trim());

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    tourCardHolders.push({
      firstName,
      lastName,
    });
  }

  return tourCardHolders;
}
