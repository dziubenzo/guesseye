import Logo from '@/components/Logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeaderSkeleton() {
  return (
    <header className="flex justify-between text-center">
      <Logo location="headerGuest" />
      <div className="flex gap-2 w-full justify-between sm:w-auto sm:justify-start">
        <Skeleton className="h-9 w-[125px]" />
        <Skeleton className="h-9 w-9" />
      </div>
    </header>
  );
}
