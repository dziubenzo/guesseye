'use server';

import type {
  ErrorObject,
  UpdateRankingsType,
  UpdatedRanking,
} from '@/lib/types';
import { getPDCOrEloRankings, getWDFRankings } from '@/server/utils';

// PDC rankings
const urlMenPDC = 'https://www.dartsrankings.com/';
const rankingsSelectorMenPDC = 'tr td:first-child';
const fullNamesSelectorMenPDC = 'tr td:nth-child(3)';

const urlWomenPDC = 'https://www.dartsrankings.com/womens-series';
const rankingsSelectorWomenPDC = 'tr td:first-child';
const fullNamesSelectorWomenPDC = 'tr td:nth-child(2)';

// WDF rankings
const urlMenWDF = 'https://dartswdf.com/rankings/wdf-main-ranking-open';
const rankingsSelectorMenWDF = 'div.text-sm a.inline-flex span:first-child';
const fullNamesSelectorMenWDF = 'div.text-sm a.inline-flex span.truncate';

const urlWomenWDF = 'https://dartswdf.com/rankings/wdf-main-ranking-women';
const rankingsSelectorWomenWDF = 'div.text-sm a.inline-flex span:first-child';
const fullNamesSelectorWomenWDF = 'div.text-sm a.inline-flex span.truncate';

// Elo rankings
const urlElo = 'https://www.dartsrec.com/power-rankings';
const rankingsSelectorElo = 'tr td:first-child';
const fullNamesSelectorElo = 'tr td:nth-child(2)';

export default async function getUpdatedRankings(type: UpdateRankingsType) {
  let updatedRankings: UpdatedRanking[] | ErrorObject;

  if (type === 'menPDC') {
    updatedRankings = await getPDCOrEloRankings(
      urlMenPDC,
      rankingsSelectorMenPDC,
      fullNamesSelectorMenPDC
    );
  } else if (type === 'womenPDC') {
    updatedRankings = await getPDCOrEloRankings(
      urlWomenPDC,
      rankingsSelectorWomenPDC,
      fullNamesSelectorWomenPDC
    );
  } else if (type === 'menWDF') {
    updatedRankings = await getWDFRankings(
      urlMenWDF,
      rankingsSelectorMenWDF,
      fullNamesSelectorMenWDF,
      500
    );
  } else if (type === 'womenWDF') {
    updatedRankings = await getWDFRankings(
      urlWomenWDF,
      rankingsSelectorWomenWDF,
      fullNamesSelectorWomenWDF,
      500
    );
  } else {
    updatedRankings = await getPDCOrEloRankings(
      urlElo,
      rankingsSelectorElo,
      fullNamesSelectorElo
    );
  }

  return updatedRankings;
}
