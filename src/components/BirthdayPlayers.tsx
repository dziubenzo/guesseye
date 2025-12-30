import { CardTitle } from '@/components/ui/card';
import { getBirthdayPlayers } from '@/server/db/get-birthday-players';

export default async function BirthdayPlayers() {
  const birthdayPlayers = await getBirthdayPlayers();

  return (
    <div className="flex flex-col gap-2 text-start">
      <CardTitle className="text-2xl mb-1">Birthday Darts Players</CardTitle>
      <div className="flex flex-col gap-2 text-sm sm:text-base">
        {birthdayPlayers.length === 0 ? (
          <p>
            None of the darts players in the database has their birthday today.
          </p>
        ) : (
          <>
            <p>The following darts players celebrate their birthday today:</p>
            <ul className="list-disc list-inside">
              {birthdayPlayers.map((birthdayPlayer, index) => {
                return (
                  <li key={index}>
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
