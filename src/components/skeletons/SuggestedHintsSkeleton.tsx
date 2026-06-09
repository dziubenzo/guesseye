import InlineSkeleton from '@/components/skeletons/InlineSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuggestedHintsSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium">
          Suggested Hints (<InlineSkeleton className="p-0" fill={0} />)
        </h1>
        <Skeleton className="w-full h-42 sm:h-32" />
        <Skeleton className="w-full h-42 sm:h-32" />
      </div>
    </>
  );
}
