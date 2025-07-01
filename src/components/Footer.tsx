import { Button } from '@/components/ui/button';
import { getLastDatabaseUpdate } from '@/server/db/get-last-database-update';
import { getPlayerCount } from '@/server/db/get-player-count';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function Footer() {
  const [playerCount, lastDBUpdate] = await Promise.all([
    getPlayerCount(),
    getLastDatabaseUpdate(),
  ]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 place-items-center rounded-md text-center p-4">
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs">Players in the Database</p>
        <p className="text-lg">{playerCount}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs">Last Database Update</p>
        <p className="text-lg">
          {lastDBUpdate ? format(lastDBUpdate, 'dd MMMM y') : 'N/A'}
        </p>
      </div>
      <div className="flex col-span-2 sm:col-span-1 items-center gap-4">
        <Button className="cursor-pointer" variant="link" asChild>
          <Link href="/">About</Link>
        </Button>
        <Button className="cursor-pointer" variant="link" asChild>
          <Link href="/">Contact</Link>
        </Button>
      </div>
    </div>
  );
}
