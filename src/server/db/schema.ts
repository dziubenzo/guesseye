import { relations, SQL, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

// Authentication

export const roleEnum = pgEnum('role_enum', ['user', 'admin']);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: roleEnum('role').notNull().default('user'),
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
  'Evolution',
  'Darts GB',
  'Superdarts',
  'Pentathlon',
  'Robson',
  'XQ Max',
  'Victory',
  '95Darts',
  'Grand Slam',
  'Puma',
  'Elkadart',
  'Quantum Darts',
  'Elven Darts',
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

export const bestResultPDCEnum = pgEnum('best_pdc_result', [
  'Last 128', // 2026 onwards
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

export const bestResultUKOpenEnum = pgEnum('best_uk_open_result', [
  'Last 178', // 2012 prelims
  'Last 176', // 2005, 2007 prelims
  'Last 172', // 2011 prelims
  'Last 160', // 1st round
  'Last 147', // 2015 prelims
  'Last 146', // 2013 prelims
  'Last 138', // 2010, 2014 prelims
  'Last 136', // 2006, 2008 prelims
  'Last 131', // 2003 prelims
  'Last 130', // 2004 prelims
  'Last 129', // 2009 prelims
  'Last 128', // 2nd round
  'Last 96', // 3rd round
  'Last 64', // 4th round
  'Last 32', // 5th round
  'Last 16', // 6th round
  'Quarter-Finals',
  'Semi-Finals',
  'Runner-Up',
  'Winner',
]);
export const bestResultUKOpenEnumValues = bestResultUKOpenEnum.enumValues;

export const playerStatusEnum = pgEnum('player_status', [
  'active',
  'retired',
  'deceased',
]);
export const playerStatusEnumValues = playerStatusEnum.enumValues;

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
    tourCard: boolean('tour_card').notNull(),
    rankingElo: integer('ranking_elo'),
    rankingPDC: integer('ranking_pdc'),
    rankingWDF: integer('ranking_wdf'),
    nineDartersPDC: integer('nine_darters_pdc').default(0).notNull(),
    bestResultPDC: bestResultPDCEnum('best_pdc_result'),
    yearOfBestResultPDC: integer('year_of_best_pdc_result'),
    bestResultWDF: bestResultWDFEnum('best_wdf_result'),
    yearOfBestResultWDF: integer('year_of_best_wdf_result'),
    bestResultUKOpen: bestResultUKOpenEnum('best_uk_open_result'),
    yearOfBestResultUKOpen: integer('year_of_best_uk_open_result'),
    playedInWCOD: boolean('played_in_wcod').notNull(),
    status: playerStatusEnum('status').default('active').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
  },
  ({
    playingSince,
    nineDartersPDC,
    yearOfBestResultPDC,
    yearOfBestResultWDF,
    yearOfBestResultUKOpen,
    rankingElo,
    rankingPDC,
    rankingWDF,
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
      'is_year_best_uk_open_result',
      sql`${yearOfBestResultUKOpen} >= 1900 AND ${yearOfBestResultUKOpen} < 2100`
    ),
    check(
      'is_proper_ranking_elo',
      sql`${rankingElo} >= 1 AND ${rankingElo} <= 750`
    ),
    check(
      'is_proper_ranking_pdc',
      sql`${rankingPDC} >= 1 AND ${rankingPDC} <= 500`
    ),
    check(
      'is_proper_ranking_wdf',
      sql`${rankingWDF} >= 1 AND ${rankingWDF} <= 2500`
    ),
  ]
);

export const schedule = pgTable('schedule', {
  id: serial('id').primaryKey(),
  playerToFindId: integer('player_to_find_id')
    .notNull()
    .references(() => player.id, { onDelete: 'restrict' }),
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
      (): SQL => sql`${schedule.startDate} + interval '1' day`
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

export const modeEnum = pgEnum('mode', ['official', 'random']);
export const gameStatusEnum = pgEnum('game_status', [
  'inProgress',
  'won',
  'givenUp',
]);

export const game = pgTable(
  'game',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    guestIp: text('guest_ip'),
    guestUserAgent: text('guest_user_agent'),
    scheduledPlayerId: integer('scheduled_player_id').references(
      () => schedule.id,
      { onDelete: 'restrict' }
    ),
    randomPlayerId: integer('random_player_id').references(() => player.id, {
      onDelete: 'restrict',
    }),
    startDate: timestamp('start_date', {
      precision: 0,
    })
      .notNull()
      .defaultNow(),
    endDate: timestamp('end_date', {
      precision: 0,
    }),
    mode: modeEnum('mode').notNull(),
    status: gameStatusEnum('status').notNull().default('inProgress'),
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
    .references(() => player.id, { onDelete: 'restrict' }),
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

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
