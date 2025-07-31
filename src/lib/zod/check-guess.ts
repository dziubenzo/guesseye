import {
  bestResultPDCEnumValues,
  bestResultUKOpenEnumValues,
  bestResultWDFEnumValues,
  dartsBrandEnumValues,
  dartsWeightEnumValues,
  genderEnumValues,
  lateralityEnumValues,
  playerStatusEnumValues,
} from '@/server/db/schema';
import { z } from 'zod';

export const guessSchema = z.object({
  guess: z.string().min(3).max(64).trim(),
  scheduleId: z.string().optional(),
  mode: z.union([z.literal('official'), z.literal('random')]),
  currentMatches: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum(genderEnumValues).optional(),
    dateOfBirth: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.string(), z.null()]),
      })
      .optional(),
    country: z.string().optional(),
    playingSince: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    dartsBrand: z.union([z.enum(dartsBrandEnumValues), z.null()]).optional(),
    dartsWeight: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.enum(dartsWeightEnumValues), z.null()]),
      })
      .optional(),
    laterality: z.enum(lateralityEnumValues).optional(),
    tourCard: z.boolean().optional(),
    rankingElo: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    rankingPDC: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    rankingWDF: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    nineDartersPDC: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.number(),
      })
      .optional(),
    bestResultPDC: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.enum(bestResultPDCEnumValues), z.null()]),
      })
      .optional(),
    yearOfBestResultPDC: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    bestResultWDF: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.enum(bestResultWDFEnumValues), z.null()]),
      })
      .optional(),
    yearOfBestResultWDF: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    bestResultUKOpen: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.enum(bestResultUKOpenEnumValues), z.null()]),
      })
      .optional(),
    yearOfBestResultUKOpen: z
      .object({
        type: z.union([
          z.literal('higher'),
          z.literal('lower'),
          z.literal('match'),
        ]),
        value: z.union([z.number(), z.null()]),
      })
      .optional(),
    playedInWCOD: z.boolean().optional(),
    status: z.enum(playerStatusEnumValues).optional(),
  }),
});

export type GuessSchemaType = z.infer<typeof guessSchema>;
