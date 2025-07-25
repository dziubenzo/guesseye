'use server';

import { auth } from '@/lib/auth';
import type {
  DatabaseStats,
  DatabaseStatsObject,
  ErrorObject,
} from '@/lib/types';
import {
  countPlayersBy,
  sortPlayerStats,
  transformPlayerStats,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { unstable_cache } from 'next/cache';
import { headers } from 'next/headers';

export const getDatabaseStats = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  const stats = await getCachedDatabaseStats();

  return stats;
};

const getCachedDatabaseStats = unstable_cache(
  async () => {
    // Get all players
    const players = await db.query.player.findMany({
      columns: { id: false, createdAt: false, updatedAt: false },
    });

    if (players.length === 0) {
      const error: ErrorObject = {
        error: 'No darts players in the database.',
      };
      return error;
    }

    const playerObject: DatabaseStatsObject = {
      gender: {},
      age: {},
      birthMonth: {},
      birthDate: {},
      birthDay: {},
      country: {},
      playingSince: {},
      laterality: {},
      dartsBrand: {},
      dartsWeight: {},
      nineDartersPDC: {},
      bestResultPDC: {},
      bestResultWDF: {},
      bestResultUKOpen: {},
      yearOfBestResultPDC: {},
      yearOfBestResultWDF: {},
      yearOfBestResultUKOpen: {},
      difficulty: {},
    };

    const stats: DatabaseStats = {
      gender: [],
      age: [],
      birthMonth: [],
      birthDate: [],
      birthDay: [],
      country: [],
      playingSince: [],
      laterality: [],
      dartsBrand: [],
      dartsWeight: [],
      nineDartersPDC: [],
      bestResultPDC: [],
      bestResultWDF: [],
      bestResultUKOpen: [],
      yearOfBestResultPDC: [],
      yearOfBestResultWDF: [],
      yearOfBestResultUKOpen: [],
      difficulty: [],
    };

    players.forEach((player) => {
      let key: keyof DatabaseStatsObject;

      for (key in playerObject) {
        countPlayersBy(player, playerObject[key], key);
      }
    });

    transformPlayerStats(stats, playerObject, players);
    sortPlayerStats(stats);

    return stats;
  },
  ['databaseStats'],
  { tags: ['databaseStats'] }
);
