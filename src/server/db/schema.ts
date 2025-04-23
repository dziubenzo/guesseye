import { InferSelectModel, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Authentication

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Darts players

export const genderEnum = pgEnum('gender', ['male', 'female']);
export const dartsBrandEnum = pgEnum('darts_brand', [
  'Target',
  "Bull's",
  'Harrows',
  'Unicorn',
  'Winmau',
  'Red Dragon',
  'Shot',
  'Nodor',
  'Cosmo',
]);
export const dartsWeightEnum = pgEnum('darts_weight', [
  '10g',
  '11g',
  '12g',
  '13g',
  '14g',
  '15g',
  '16g',
  '17g',
  '18g',
  '19g',
  '20g',
  '21g',
  '22g',
  '23g',
  '24g',
  '25g',
  '26g',
  '27g',
  '28g',
  '29g',
  '30g',
  '31g',
  '32g',
  '33g',
  '34g',
  '35g',
  '36g',
  '37g',
  '38g',
  '39g',
  '40g',
]);
export const lateralityEnum = pgEnum('laterality', [
  'right-handed',
  'left-handed',
]);
export const organisationEnum = pgEnum('organisation', ['PDC', 'WDF', 'BDO']);

export const bestResultPDCEnum = pgEnum('best_pdc_result', [
  'Preliminary Round',
  'First Round',
  'Second Round',
  'Third Round',
  'Fourth Round',
  'Quarter-Finals',
  'Semi-Finals',
  'Runner-Up',
  'Winner',
  // For World Championships with the group stage (1994-1998)
  'Third Place in Group',
  'Second Place in Group',
  'Fourth Place',
  'Third Place',
]);

export const bestResultWDFEnum = pgEnum('best_wdf_result', [
  'Preliminary Round',
  'First Round',
  'Second Round',
  'Third Round',
  'Quarter-Finals',
  'Semi-Finals',
  'Fourth Place',
  'Third Place',
  'Runner-Up',
  'Winner',
]);

export const difficultyEnum = pgEnum('difficulty', [
  'easy',
  'medium',
  'hard',
  'very hard',
]);

export const player = pgTable(
  'player',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    gender: genderEnum('gender').notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    country: text('country').notNull(),
    playingSince: integer('playing_since'),
    dartsBrand: dartsBrandEnum('darts_brand'),
    dartsWeight: dartsWeightEnum('darts_weight'),
    laterality: lateralityEnum('laterality').notNull(),
    organisation: organisationEnum('organisation').notNull(),
    tourCard: boolean('tour_card').notNull(),
    rankingPDC: integer('ranking_pdc'),
    rankingWDF: integer('ranking_wdf'),
    prizeMoney: real('prize_money'),
    bestResultPDC: bestResultPDCEnum('best_pdc_result'),
    yearOfBestResultPDC: integer('year_of_best_pdc_result'),
    bestResultWDF: bestResultWDFEnum('best_wdf_result'),
    yearOfBestResultWDF: integer('year_of_best_wdf_result'),
    playedInWCOD: boolean('played_in_wcod').notNull(),
    playedInWDF: boolean('played_in_wdf').notNull(),
    active: boolean('active').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
  },
  ({
    playingSince,
    yearOfBestResultPDC,
    yearOfBestResultWDF,
    rankingPDC,
    rankingWDF,
    prizeMoney,
  }) => [
    check(
      'is_year_playing_since',
      sql`${playingSince} >= 1900 AND ${playingSince} < 2100`
    ),
    check(
      'is_year_best_pdc_result',
      sql`${yearOfBestResultPDC} >= 1900 AND ${yearOfBestResultPDC} < 2100`
    ),
    check(
      'is_year_best_wdf_result',
      sql`${yearOfBestResultWDF} >= 1900 AND ${yearOfBestResultWDF} < 2100`
    ),
    check(
      'is_proper_ranking_PDC',
      sql`${rankingPDC} >= 1 AND ${rankingPDC} <= 250`
    ),
    check(
      'is_proper_ranking_WDF',
      sql`${rankingWDF} >= 1 AND ${rankingWDF} <= 2000`
    ),
    check('is_non_negative', sql`${prizeMoney} >= 0`),
  ]
);

export type Player = InferSelectModel<typeof player>;
