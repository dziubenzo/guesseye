'use client';

import { useSession } from '@/lib/auth-client';

export default function Home() {
  const { isPending, data } = useSession();

  if (isPending) {
    return <h1 className="text-center">Loading...</h1>;
  }

  if (data) {
    return <h1 className="text-center">Logged In GuessEye</h1>;
  }

  return <h1 className="text-center">GuessEye</h1>;
}
