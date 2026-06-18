import DeleteAccount from '@/components/DeleteAccount';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateNameForm from '@/components/UpdateNameForm';
import UpdateVeryHardForm from '@/components/UpdateVeryHardForm';
import type { Session } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { use } from 'react';

type SettingsProps = {
  sessionPromise: Promise<Session | null>;
};

export default function Settings({ sessionPromise }: SettingsProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 grow-1 text-sm/6 sm:text-base/6">
        <p>
          Here you can change your name, add extra darts players to the random
          mode pool, or delete your account.
        </p>
        <UpdateNameForm currentName={session.user.name} />
        <UpdateVeryHardForm currentSetting={session.user.allowVeryHard} />
        <DeleteAccount email={session.user.email} />
      </CardContent>
    </>
  );
}
