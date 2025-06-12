import { relations, SQL, sql } from 'drizzle-orm';
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

export const userRelations = relations(user, ({ many }) => ({
  games: many(game),
}));

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
export const genderEnumValues = genderEnum.enumValues;

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
  'Dpuls',
  'Mission',
  'Datadart',
  'Trinidad',
  'KOTO',
  'Cuesoul',
  'Designa',
  'Caliburn',
  'Dynasty',
  'Galaxy',
  'Legend Darts',
  'Loxley',
  'McCoy',
  'McKicks',
  'One80',
  'Performance Darts',
  'Ruthless',
  'Viper',
  'Darts Unique',
  'Laserdarts',
  'Monster',
  'MasterDarts',
  'Perfect Nine',
  'Showtime Darts',
  'Custom',
  'Karella',
]);
export const dartsBrandEnumValues = dartsBrandEnum.enumValues;

export const dartsWeightEnum = pgEnum('darts_weight', [
  '10g',
  '11g',
  '12g',
  '13g',
  '14g',
  '15g',
  '15.5g',
  '16g',
  '16.5g',
  '17g',
  '17.5g',
  '18g',
  '18.5g',
  '19g',
  '19.5g',
  '20g',
  '20.5g',
  '21g',
  '21.5g',
  '22g',
  '22.5g',
  '23g',
  '23.5g',
  '24g',
  '24.5g',
  '25g',
  '25.5g',
  '26g',
  '26.5g',
  '27g',
  '27.5g',
  '28g',
  '28.5g',
  '29g',
  '29.5g',
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
export const dartsWeightEnumValues = dartsWeightEnum.enumValues;

export const lateralityEnum = pgEnum('laterality', [
  'right-handed',
  'left-handed',
]);
export const lateralityEnumValues = lateralityEnum.enumValues;

export const organisationEnum = pgEnum('organisation', ['PDC', 'WDF', 'BDO']);
export const organisationEnumValues = organisationEnum.enumValues;

export const bestResultPDCEnum = pgEnum('best_pdc_result', [
  'Last 96',
  'Last 72',
  'Last 70', // 2009
  'Last 68', // 2008
  'Last 64',
  'Last 48', // 2004-2005
  'Last 40', // 2003
  'Last 32',
  'Last 24', // 1994-1998
  'Last 16',
  'Quarter-Finals',
  'Semi-Finals',
  'Fourth Place',
  'Third Place',
  'Runner-Up',
  'Winner',
]);
export const bestResultPDCEnumValues = bestResultPDCEnum.enumValues;

export const bestResultWDFEnum = pgEnum('best_wdf_result', [
  'Last 48', // since 2022
  'Last 40', // since 2015
  'Last 33', // 1999, 1986, 1983, 1981
  'Last 32',
  'Last 24', // Women
  'Last 16',
  'Quarter-Finals',
  'Semi-Finals',
  'Fourth Place',
  'Third Place',
  'Runner-Up',
  'Winner',
]);
export const bestResultWDFEnumValues = bestResultWDFEnum.enumValues;

export const difficultyEnum = pgEnum('difficulty', [
  'easy',
  'medium',
  'hard',
  'very hard',
]);
export const difficultyEnumValues = difficultyEnum.enumValues;

export const player = pgTable(
  'player',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    gender: genderEnum('gender').notNull(),
    dateOfBirth: date('date_of_birth'),
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
    nineDartersPDC: integer('nine_darters_pdc').default(0).notNull(),
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
    nineDartersPDC,
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
    check('is_non_negative_nine_darters_pdc', sql`${nineDartersPDC} >= 0`),
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
    check('is_non_negative_prize_money', sql`${prizeMoney} >= 0`),
  ]
);

export const schedule = pgTable('schedule', {
  id: serial('id').primaryKey(),
  playerToFindId: integer('player_to_find_id')
    .notNull()
    .references(() => player.id),
  startDate: timestamp('start_date', {
    precision: 0,
  })
    .notNull()
    .unique(),
  endDate: timestamp('end_date', {
    precision: 0,
  })
    .notNull()
    .unique()
    .generatedAlwaysAs(
      (): SQL => sql`${schedule.startDate} + interval '12' hour`
    ),
});

export const scheduleRelations = relations(schedule, ({ one, many }) => ({
  playerToFind: one(player, {
    relationName: 'player_to_find',
    fields: [schedule.playerToFindId],
    references: [player.id],
  }),
  games: many(game),
}));

export const gameModeEnum = pgEnum('game_mode', ['official', 'random']);

export const game = pgTable(
  'game',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => user.id),
    guestIp: text('guest_ip'),
    guestUserAgent: text('guest_user_agent'),
    scheduledPlayerId: integer('scheduled_player_id').references(
      () => schedule.id
    ),
    randomPlayerId: integer('random_player_id').references(() => player.id),
    startDate: timestamp('start_date', {
      precision: 0,
    })
      .notNull()
      .defaultNow(),
    endDate: timestamp('end_date', {
      precision: 0,
    }),
    hasWon: boolean('has_won').default(false).notNull(),
    hasGivenUp: boolean('has_given_up').default(false).notNull(),
    gameMode: gameModeEnum('game_mode').notNull(),
  },
  ({ userId, guestIp, scheduledPlayerId, randomPlayerId }) => [
    check(
      'is_either_guest_or_user',
      sql`(${userId} IS NULL) <> (${guestIp} IS NULL)`
    ),
    check(
      'is_either_scheduled_or_random_player',
      sql`(${scheduledPlayerId} IS NULL) <> (${randomPlayerId} IS NULL)`
    ),
  ]
);

export const gameRelations = relations(game, ({ one, many }) => ({
  user: one(user, {
    relationName: 'user',
    fields: [game.userId],
    references: [user.id],
  }),
  scheduledPlayer: one(schedule, {
    relationName: 'scheduled_player',
    fields: [game.scheduledPlayerId],
    references: [schedule.id],
  }),
  randomPlayer: one(player, {
    relationName: 'random_player',
    fields: [game.randomPlayerId],
    references: [player.id],
  }),
  guesses: many(guess),
}));

export const guess = pgTable('guess', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => game.id, { onDelete: 'cascade' }),
  playerId: integer('player_id')
    .notNull()
    .references(() => player.id),
  time: timestamp('time', { mode: 'date' }).notNull().defaultNow(),
});

export const guessRelations = relations(guess, ({ one }) => ({
  game: one(game, {
    relationName: 'game',
    fields: [guess.gameId],
    references: [game.id],
  }),
  player: one(player, {
    relationName: 'player',
    fields: [guess.playerId],
    references: [player.id],
  }),
}));
