import ManageHintForm from '@/components/ManageHintForm';
import type { SuggestedHint } from '@/lib/types';

type SuggestedHintsProps = {
  hints: SuggestedHint[];
};

export default function SuggestedHints({ hints }: SuggestedHintsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Suggested Hints ({hints.length})</h1>
      {hints.length === 0 ? (
        <p>No suggested hints to show.</p>
      ) : (
        hints.map((hint) => <ManageHintForm key={hint.id} hint={hint} />)
      )}
    </div>
  );
}
