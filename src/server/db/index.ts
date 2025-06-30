import * as schema from '@/server/db/schema';
import * as dotenvx from '@dotenvx/dotenvx';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(dotenvx.get('DATABASE_URL'), {
  schema,
  logger: true,
});
