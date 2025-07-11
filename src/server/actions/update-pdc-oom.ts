'use server';

import type { ErrorObject, UpdateAction, UpdatedRankings } from '@/lib/types';
import { handleDifferentSpellings, normaliseString } from '@/lib/utils';
import { db } from '@/server/db';
import { player as playerSchema } from '@/server/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import puppeteer from 'puppeteer';

export default async function updatePDCOoM() {
  const updatedRankings = await getPDCOoM();

  let result: UpdateAction;

  if ('error' in updatedRankings) {
    result = {
      type: 'error',
      message: updatedRankings.error,
    };
    return result;
  }

  // Get male darts players
  const players = await db.query.player.findMany({
    where: eq(playerSchema.gender, 'male'),
    columns: { firstName: true, lastName: true, rankingPDC: true },
  });

  // Set PDC ranking value to null for all male darts players
  await db
    .update(playerSchema)
    .set({ rankingPDC: null })
    .where(
      and(isNotNull(playerSchema.rankingPDC), eq(playerSchema.gender, 'male'))
    );

  let updateCount = 0;

  // Update PDC ranking of a darts player if their first name and last name match the scraped data
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
        .set({ rankingPDC: updatedRanking.ranking })
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

  // Clear the players cache
  revalidateTag('players');

  result = {
    type: 'success',
    message: `PDC Order of Merit rankings updated successfully. ${updateCount} players out of ${players.length} male players in the DB were updated. There are ${updatedRankings.length} players in the PDC Order of Merit, including ${updatedRankings.length - updateCount === 1 ? 'female' : 'females'}.`,
  };

  return result;
}

async function getPDCOoM() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.dartsrankings.com/');

  await page.setViewport({ width: 1080, height: 1024 });

  const updatedRankings: UpdatedRankings = [];

  // Get current rankings from the first data cell
  const rankings = await page.$$eval('tr td:first-child', (rankingTds) => {
    return rankingTds.map((rankingTd) => rankingTd.textContent);
  });

  // Get full names from the third data cell
  const fullNames = await page.$$eval('tr td:nth-child(3)', (fullNameTds) => {
    return fullNameTds.map((fullNameTd) => fullNameTd.textContent);
  });

  if (rankings.length !== fullNames.length) {
    const error: ErrorObject = {
      error: 'Ranking and full name array lengths do not match.',
    };
    return error;
  }

  // Build the object
  rankings.forEach((ranking, index) => {
    if (ranking === null || fullNames[index] === null) {
      const error: ErrorObject = {
        error: 'Ranking or full name array item is empty.',
      };
      return error;
    }

    const rankingNumber = parseInt(ranking);

    if (Number.isNaN(rankingNumber)) {
      const error: ErrorObject = {
        error: 'Ranking is not a number.',
      };
      return error;
    }

    const fullName = handleDifferentSpellings(fullNames[index].trim());

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    updatedRankings.push({
      ranking: rankingNumber,
      firstName,
      lastName,
    });
  });

  return updatedRankings;
}
