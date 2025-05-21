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
import { notFound } from 'next/navigation';

export default async function OfficialGames() {
  const officialGames = await getOfficialGames();

  if ('error' in officialGames) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card>
        <CardHeader>
          <CardTitle>All Official Games</CardTitle>
          <CardDescription>
            Here you can find all official games.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={officialGames} />
        </CardContent>
      </Card>
    </div>
  );
}
