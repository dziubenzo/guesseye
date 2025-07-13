'use server';

import type { ErrorObject, UpdatedRankings } from '@/lib/types';
import { getPDCOoM, getWDFOoM } from '@/server/utils';

// PDC rankings
const urlMenPDC = 'https://www.dartsrankings.com/';
const rankingsSelectorMenPDC = 'tr td:first-child';
const fullNamesSelectorMenPDC = 'tr td:nth-child(3)';

const urlWomenPDC = 'https://www.dartsrankings.com/womens-series';
const rankingsSelectorWomenPDC = 'tr td:first-child';
const fullNamesSelectorWomenPDC = 'tr td:nth-child(2)';

// WDF rankings
const urlMenWDF = 'https://dartswdf.com/rankings/wdf-main-ranking-men';
const rankingsSelectorMenWDF = 'div.text-sm a.inline-flex span:first-child';
const fullNamesSelectorMenWDF = 'div.text-sm a.inline-flex span.truncate';

const urlWomenWDF = 'https://dartswdf.com/rankings/wdf-main-ranking-women';
const rankingsSelectorWomenWDF = 'div.text-sm a.inline-flex span:first-child';
const fullNamesSelectorWomenWDF = 'div.text-sm a.inline-flex span.truncate';

export default async function getUpdatedRankings(
  organisation: 'PDC' | 'WDF',
  type: 'men' | 'women'
) {
  let updatedRankings: UpdatedRankings[] | ErrorObject;

  if (organisation === 'PDC' && type === 'men') {
    updatedRankings = await getPDCOoM(
      urlMenPDC,
      rankingsSelectorMenPDC,
      fullNamesSelectorMenPDC
    );
  } else if (organisation === 'PDC' && type === 'women') {
    updatedRankings = await getPDCOoM(
      urlWomenPDC,
      rankingsSelectorWomenPDC,
      fullNamesSelectorWomenPDC
    );
  } else if (organisation === 'WDF' && type === 'men') {
    updatedRankings = await getWDFOoM(
      urlMenWDF,
      rankingsSelectorMenWDF,
      fullNamesSelectorMenWDF,
      500
    );
  } else {
    updatedRankings = await getWDFOoM(
      urlWomenWDF,
      rankingsSelectorWomenWDF,
      fullNamesSelectorWomenWDF,
      500
    );
  }

  return updatedRankings;
}
