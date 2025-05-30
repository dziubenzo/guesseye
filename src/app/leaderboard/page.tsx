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
import { notFound } from 'next/navigation';

export default async function Leaderboard() {
  const leaderboard = await getLeaderboard();

  if ('error' in leaderboard) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Leaderboard</CardTitle>
          <CardDescription>
            <p>
              Here you can find the rank of every user based on wins and give
              ups.
            </p>
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
