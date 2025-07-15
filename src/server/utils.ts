'use server';

import { auth } from '@/lib/auth';
import type {
  ErrorObject,
  TourCardHolders,
  UpdateRankingsOrganisation,
  UpdateRankingsType,
  UpdatedRankings,
} from '@/lib/types';
import { handleDifferentSpellings, normaliseString } from '@/lib/utils';
import { db } from '@/server/db';
import { lower, player as playerSchema, user } from '@/server/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import { headers } from 'next/headers';
import puppeteer from 'puppeteer';

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

// Get PDC Order of Merits
export async function getPDCOoM(
  url: string,
  rankingsSelector: string,
  fullNamesSelector: string
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  const updatedRankings: UpdatedRankings[] = [];

  // Get current rankings from the selector
  const rankings = await page.$$eval(rankingsSelector, (rankingTds) => {
    return rankingTds.map((rankingTd) => rankingTd.textContent);
  });

  // Get full names from the selector
  const fullNames = await page.$$eval(fullNamesSelector, (fullNameTds) => {
    return fullNameTds.map((fullNameTd) => fullNameTd.textContent);
  });

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

    updatedRankings.push({
      ranking: rankingNumber,
      firstName,
      lastName,
    });
  }

  return updatedRankings;
}

// Get WDF Order of Merits
export async function getWDFOoM(
  url: string,
  rankingsSelector: string,
  fullNamesSelector: string,
  limit: number
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 1080, height: 1024 });

  const updatedRankings: UpdatedRankings[] = [];

  // Get current rankings from the selector, applying the limit
  const rankings = await page.$$eval(
    rankingsSelector,
    (rankingSpans, limit) => {
      return rankingSpans
        .slice(0, limit)
        .map((rankingSpan) => rankingSpan.textContent);
    },
    limit
  );

  // Get full names from the selector, applying the limit
  const fullNames = await page.$$eval(
    fullNamesSelector,
    (fullNameSpans, limit) => {
      return fullNameSpans
        .slice(0, limit)
        .map((fullNameSpan) => fullNameSpan.textContent);
    },
    limit
  );

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

    updatedRankings.push({
      ranking: rankingNumber,
      firstName,
      lastName,
    });
  }

  return updatedRankings;
}

export async function updateDBRankings(
  organisation: UpdateRankingsOrganisation,
  type: UpdateRankingsType,
  updatedRankings: UpdatedRankings[]
) {
  // Get darts players
  const players = await db.query.player.findMany({
    where: eq(playerSchema.gender, type === 'men' ? 'male' : 'female'),
    columns: { firstName: true, lastName: true },
  });

  // Set ranking value to null for all darts players
  await db
    .update(playerSchema)
    .set(organisation === 'PDC' ? { rankingPDC: null } : { rankingWDF: null })
    .where(
      and(
        isNotNull(
          organisation === 'PDC'
            ? playerSchema.rankingPDC
            : playerSchema.rankingWDF
        ),
        eq(playerSchema.gender, type === 'men' ? 'male' : 'female')
      )
    );

  let updateCount = 0;

  // Update the ranking of a darts player if their first name and last name match the scraped data
  for (const player of players) {
    for (const updatedRanking of updatedRankings) {
      const playerFirstName = normaliseString(player.firstName);
      const playerLastName = normaliseString(player.lastName);
      const updatedPlayerFirstName = normaliseString(updatedRanking.firstName);
      const updatedPlayerLastName = normaliseString(updatedRanking.lastName);

      if (
        playerFirstName !== updatedPlayerFirstName ||
        playerLastName !== updatedPlayerLastName
      ) {
        continue;
      }

      await db
        .update(playerSchema)
        .set(
          organisation === 'PDC'
            ? { rankingPDC: updatedRanking.ranking }
            : { rankingWDF: updatedRanking.ranking }
        )
        .where(
          and(
            eq(playerSchema.firstName, player.firstName),
            eq(playerSchema.lastName, player.lastName)
          )
        );
      updateCount++;
      break;
    }
  }

  return { updateCount, playersDB: players.length };
}

// Get current Tour Card Holders
export async function getTourCardHolders() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://pdpa.co.uk/event-entry/tour-cards/');

  await page.setViewport({ width: 1080, height: 1024 });

  const tourCardHolders: TourCardHolders[] = [];

  // Get full names
  const fullNames = await page.$$eval('tr td:nth-child(3)', (fullNameSpans) => {
    return fullNameSpans.map((fullNameSpan) => fullNameSpan.textContent);
  });

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
