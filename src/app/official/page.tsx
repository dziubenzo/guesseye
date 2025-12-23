import { columns } from '@/app/official/columns';
import DataTable from '@/app/official/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getOfficialGames } from '@/server/db/get-official-games';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Official Games' };

export default async function OfficialGames() {
  const officialGames = await getOfficialGames();

  if ('error' in officialGames) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Official Games</CardTitle>
          <CardDescription>
            <p>Here you can find all official games.</p>
            <p>
              If you haven&apos;t played or finished some of the games, you can
              either start playing or resume them.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            type="officialGames"
            columns={columns}
            data={officialGames}
          />
        </CardContent>
      </Card>
    </div>
  );
}
