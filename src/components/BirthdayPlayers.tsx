import { CardTitle } from '@/components/ui/card';
import { getBirthdayPlayers } from '@/server/db/get-birthday-players';

export default async function BirthdayPlayers() {
  const birthdayPlayers = await getBirthdayPlayers();

  return (
    <div className="flex flex-col gap-2 text-center md:text-start">
      <CardTitle className="text-2xl">Birthday Darts Players</CardTitle>
      <div className="flex flex-col gap-2 text-muted-foreground text-sm">
        {birthdayPlayers.length === 0 ? (
          <p>
            None of the darts players in the database has their birthday today.
          </p>
        ) : (
          <>
            <p>The following darts players celebrate their birthday today:</p>
            <ul className="list-none md:list-disc md:list-inside">
              {birthdayPlayers.map((birthdayPlayer, index) => {
                return (
                  <li key={index} className="text-base">
                    {birthdayPlayer.fullName} (turns {birthdayPlayer.age})
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
