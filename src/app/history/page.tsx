import { columns } from '@/app/history/columns';
import DataTable from '@/app/official/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getOfficialGamesHistory } from '@/server/db/get-official-games-history';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Official Games History' };

export default async function History() {
  const history = await getOfficialGamesHistory();

  if ('error' in history) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Official Games History</CardTitle>
          <CardDescription>
            <p>
              Here you can find winners of every official game by three
              categories: first, fastest and fewest guesses.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            type={'officialGamesHistory'}
            columns={columns}
            data={history}
          />
        </CardContent>
      </Card>
    </div>
  );
}
