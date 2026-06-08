import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getLastDatabaseUpdate } from '@/server/db/get-last-database-update';
import { getPlayerCount } from '@/server/db/get-player-count';
import { format } from 'date-fns';
import Link from 'next/link';
import { Suspense, use } from 'react';

export default async function Footer() {
  const playerCount = getPlayerCount();
  const lastDatabaseUpdate = getLastDatabaseUpdate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center rounded-md text-center p-0 md:p-4">
      <Logo location="footer" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs">Players in the Database</p>
        <Suspense fallback={<Skeleton className="h-7 w-14" />}>
          <PlayerCount playerCountPromise={playerCount} />
        </Suspense>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs">Last Database Update</p>
        <Suspense fallback={<Skeleton className="h-7 w-26" />}>
          <LastDatabaseUpdate lastDatabaseUpdatePromise={lastDatabaseUpdate} />
        </Suspense>
      </div>
      <div className="flex col-span-2 md:col-span-1 items-center gap-4">
        <Button className="cursor-pointer" variant="link" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button className="cursor-pointer" variant="link" asChild>
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </div>
  );
}

type PlayerCountProps = {
  playerCountPromise: Promise<number>;
};

function PlayerCount({ playerCountPromise }: PlayerCountProps) {
  const playerCount = use(playerCountPromise);

  return <p className="text-lg">{playerCount}</p>;
}

type LastDatabaseUpdateProps = {
  lastDatabaseUpdatePromise: Promise<Date | undefined>;
};

function LastDatabaseUpdate({
  lastDatabaseUpdatePromise,
}: LastDatabaseUpdateProps) {
  const lastDatabaseUpdate = use(lastDatabaseUpdatePromise);

  return (
    <p className="text-lg">
      {lastDatabaseUpdate ? format(lastDatabaseUpdate, 'dd MMMM y') : 'N/A'}
    </p>
  );
}
