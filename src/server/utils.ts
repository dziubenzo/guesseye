'use server';

import { headers } from 'next/headers';

export async function getIPAndUserAgent() {
  'use server';
  const headersList = await headers();
  const userAgent = headersList.get('User-Agent') || '';
  const clientIP = (headersList.get('X-Forwarded-For') || '')
    .split(',')[0]
    .trim();

  return { clientIP, userAgent };
}
