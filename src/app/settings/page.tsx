import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UpdateNameForm from '@/components/UpdateNameForm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Settings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Account Settings</CardTitle>
          <CardDescription>
            <p>
              Here you can change your name or delete your account altogether.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateNameForm />
        </CardContent>
      </Card>
    </div>
  );
}
