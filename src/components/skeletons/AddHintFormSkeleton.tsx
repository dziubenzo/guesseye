import { Skeleton } from '@/components/ui/skeleton';

export default function AddHintFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-full sm:w-[350px]" />
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-none font-medium">Hint:</p>
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
