import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col grow-1 justify-center items-center gap-6">
      <Image
        src="/dartboard.svg"
        alt="Dartboard"
        width={256}
        height={256}
        priority
        className="animate-[spin_2s_linear_infinite] hover:paused rounded-full blur-xs hover:blur-none"
      />
      <div className="flex flex-col gap-1 items-center justify-center">
        <p className="text-2xl">Loading...</p>
        <p className="text-sm">Please wait...</p>
      </div>
    </div>
  );
}
