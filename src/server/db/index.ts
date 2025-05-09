import * as schema from '@/server/db/schema';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.DATABASE_URL!, { schema, logger: true });
