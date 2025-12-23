import DeleteAccount from '@/components/DeleteAccount';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UpdateNameForm from '@/components/UpdateNameForm';
import UpdateVeryHardForm from '@/components/UpdateVeryHardForm';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Settings' };

export default async function Settings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Account Settings</CardTitle>
          <CardDescription>
            <p>
              Here you can change your name, add extra darts players to the
              random mode pool, or delete your account.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 grow-1">
          <UpdateNameForm currentName={session.user.name} />
          <UpdateVeryHardForm currentSetting={session.user.allowVeryHard} />
          <DeleteAccount email={session.user.email} />
        </CardContent>
      </Card>
    </div>
  );
}
