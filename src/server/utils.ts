'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, UpdatedRankings } from '@/lib/types';
import { handleDifferentSpellings } from '@/lib/utils';
import { db } from '@/server/db';
import { lower, user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
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

  const updatedRankings: UpdatedRankings = [];

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
