import AuthModal from '@/components/AuthModal';
import HeaderMenu from '@/components/HeaderMenu';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { headers } from 'next/headers';

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return <HeaderMenu username={session.user.name} role={session.user.role} />;
  }

  return (
    <header className="flex justify-between text-center">
      <Logo location="headerGuest" />
      <div className="flex gap-2 w-full justify-between sm:w-auto sm:justify-start">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Log In/Sign Up</Button>
          </DialogTrigger>
          <AuthModal />
        </Dialog>
        <ThemeToggle type="header" />
      </div>
    </header>
  );
}
