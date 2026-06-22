'use server';

import type { DatabaseStats, DatabaseStatsObject } from '@/lib/types';
import {
  countPlayersBy,
  sortPlayerStats,
  transformPlayerStats,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { cacheLife, cacheTag } from 'next/cache';

export const getDatabaseStats = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('databaseStats');

  // Get all players
  const players = await db.query.player.findMany({
    columns: { id: false, createdAt: false, updatedAt: false },
  });

  // This shouldn't ever happen
  if (players.length === 0) {
    throw new Error('No darts players in the database.');
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
    status: {},
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
    status: [],
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
};
