import { columns } from '@/app/leaderboard/columns';
import DataTable from '@/app/official/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getLeaderboard } from '@/server/db/get-leaderboard';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Leaderboard' };

export default async function Leaderboard() {
  const leaderboard = await getLeaderboard();

  if ('error' in leaderboard) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Leaderboard</CardTitle>
          <CardDescription className="text-sm/6">
            <p>Here you can find the leaderboard.</p>
            <p>Every user is ranked based on (in that order):</p>
            <ul className="list-disc list-inside">
              <li>Wins in official mode (descending);</li>
              <li>Wins in random mode (descending);</li>
              <li>Hints revealed (ascending);</li>
              <li>Give ups in official mode (ascending);</li>
              <li>Give ups in random mode (ascending).</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            type={'leaderboard'}
            columns={columns}
            data={leaderboard}
          />
        </CardContent>
      </Card>
    </div>
  );
}
