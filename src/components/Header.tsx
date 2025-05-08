'use client';

import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';
import { useGameStore } from '@/lib/game-store';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
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
    <header className="grid grid-flow-col text-center">
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      {data && (
        <Button className="cursor-pointer" onClick={logOut}>
          Log Out
        </Button>
      )}
      {!data && (
        <Dialog>
          <DialogTrigger className="cursor-pointer">
            Log In/Sign Up
          </DialogTrigger>
          <AuthModal />
        </Dialog>
      )}
    </header>
  );
}
