'use server';

import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { lower, user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function getIPAndUserAgent() {
  const headersList = await headers();
  const clientUserAgent = headersList.get('User-Agent') || '';
  const clientIP = (headersList.get('X-Forwarded-For') || '')
    .split(',')[0]
    .trim();

  return { clientIP, clientUserAgent };
}

export async function getUserOrGuest() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return { session, clientIP: null, clientUserAgent: null };
  } else {
    const { clientIP, clientUserAgent } = await getIPAndUserAgent();
    return { session: null, clientIP, clientUserAgent };
  }
}

export async function isNameTaken(newName: string) {
  const nameTaken = await db.query.user.findFirst({
    where: eq(lower(user.name), newName.toLowerCase()),
  });

  return nameTaken ? true : false;
}
