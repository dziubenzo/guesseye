'use client';

import AuthModal from '@/components/AuthModal';
import HeaderMenu from '@/components/HeaderMenu';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';

export default function Header() {
  const { data } = useSession();

  if (data) return <HeaderMenu username={data.user.name} />;

  return (
    <header className="grid grid-flow-col grid-cols-3 text-center items-center justify-center relative">
      <Logo location="headerGuest" />
      <div className="col-start-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer w-full sm:min-h-10 sm:h-10">
              Log In/Sign Up
            </Button>
          </DialogTrigger>
          <AuthModal />
        </Dialog>
        <ThemeToggle type="header" />
      </div>
    </header>
  );
}
