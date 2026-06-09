import { CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DatabaseStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
      <div className="flex flex-col flex-1 justify-center items-center gap-4 w-full h-full">
        <h2 className="font-medium text-center">Darts Players By Gender</h2>
        <Skeleton className="size-44 sm:size-68 rounded-full my-8" />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="font-medium text-center">Darts Players By Laterality</h2>
        <Skeleton className="size-44 sm:size-68 rounded-full my-8" />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="font-medium text-center">Darts Players By Status</h2>
        <Skeleton className="size-44 sm:size-68 rounded-full my-8" />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="font-medium text-center">Darts Players By Difficulty</h2>
        <Skeleton className="size-44 sm:size-68 rounded-full my-8" />
      </div>
    </div>
  );
}

export function BirthdayPlayersSkeleton() {
  return (
    <div className="flex flex-col gap-2 text-start">
      <CardTitle className="text-2xl mb-1">Birthday Darts Players</CardTitle>
      <div className="flex flex-col gap-2 text-sm sm:text-base">
        <Skeleton className="w-70 sm:w-96 h-4 sm:h-5" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, index) => {
            return <Skeleton className="w-40 h-4 sm:h-5" key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
