import { columns } from '@/app/leaderboard/columns';
import DataTable from '@/app/official/data-table';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/lib/auth';
import type { LeaderboardUser } from '@/lib/types';
import { getLeaderboard } from '@/server/db/get-leaderboard';
import { notFound } from 'next/navigation';
import { Suspense, use, useMemo } from 'react';

type LeaderboardProps = {
  sessionPromise: Promise<Session | null>;
};

export default function Leaderboard({ sessionPromise }: LeaderboardProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const leaderboardPromise = getLeaderboard();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
        <div>
          <p>Here you can find the leaderboard.</p>
          <p>Every user is ranked based on (in that order):</p>
        </div>
        <ul className="list-disc list-inside">
          <li>Wins in official mode (descending);</li>
          <li>Wins in random mode (descending);</li>
          <li>Hints revealed (ascending);</li>
          <li>Give ups in official mode (ascending);</li>
          <li>Give ups in random mode (ascending).</li>
        </ul>
        <Suspense fallback={<TableSkeleton rows={8} />}>
          <LeaderboardTable
            leaderboardPromise={leaderboardPromise}
            username={session.user.name}
          />
        </Suspense>
      </CardContent>
    </>
  );
}

type LeaderboardTableProps = {
  leaderboardPromise: Promise<LeaderboardUser[]>;
  username: string;
};

function LeaderboardTable({
  leaderboardPromise,
  username,
}: LeaderboardTableProps) {
  const leaderboard = use(leaderboardPromise);

  const newLeadeboard = useMemo(() => {
    return leaderboard.map((user) => {
      if (user.username === username) {
        return {
          ...user,
          isCurrentUser: true,
        };
      }
      return user;
    });
  }, [username, leaderboard]);

  const newLeaderboardPromise = new Promise<LeaderboardUser[]>((resolve) =>
    resolve(newLeadeboard)
  );

  return (
    <DataTable
      type="leaderboard"
      columns={columns}
      dataPromise={newLeaderboardPromise}
    />
  );
}
