import TextSkeleton from '@/components/skeletons/TextSkeleton';

export default function WhySignUpSkeleton() {
  return (
    <>
      <TextSkeleton>
        As you are not logged in, the only game mode available to you is the{' '}
        random mode, and it&apos;s a bit easier compared to the random mode for
        logged-in users. Also, your ongoing game might disappear when you update
        your browser or it auto-updates.
      </TextSkeleton>
      <section className="flex flex-col gap-4">
        <TextSkeleton className="text-2xl font-semibold">
          Why Should I Sign Up?
        </TextSkeleton>
        <TextSkeleton>
          If you find GuessEye fun, you might consider signing up for extra and
          completely free features. They include:
        </TextSkeleton>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <TextSkeleton key={index}>{index}</TextSkeleton>
          ))}
        </div>
      </section>
    </>
  );
}
