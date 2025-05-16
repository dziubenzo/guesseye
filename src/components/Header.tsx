'use client';

import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';
import { useGameStore } from '@/lib/game-store';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data } = useSession();
  const router = useRouter();
  const { resetState } = useGameStore();

  async function logOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          resetState();
          router.push('/');
        },
      },
    });
  }

  return (
    <header className="grid grid-flow-col lg:grid-cols-5 text-center items-center">
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>
        <Button className="cursor-pointer" variant="link" asChild>
          <Link href="/official">Official Games</Link>
        </Button>
      </p>
      {data && (
        <Button className="cursor-pointer w-full" onClick={logOut}>
          Log Out
        </Button>
      )}
      {!data && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer w-full">Log In/Sign Up</Button>
          </DialogTrigger>
          <AuthModal />
        </Dialog>
      )}
    </header>
  );
}
