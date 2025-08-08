import * as schema from '@/server/db/schema';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_DEV_URL!
    : process.env.DATABASE_URL!,
  {
    schema,
    logger: process.env.NODE_ENV === 'development' ? true : false,
  }
);
