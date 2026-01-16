'use client';

import Bold from '@/components/Bold';
import DeletedUser from '@/components/DeletedUser';
import RevealHintForm from '@/components/RevealHintForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useGameStore } from '@/lib/game-store';
import type { GameHint } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';

type HintsButtonType = {
  availableHints: number;
  gameId?: number;
};

export default function HintsButton({
  availableHints,
  gameId,
}: HintsButtonType) {
  const { hints, obfuscatedHints } = useGameStore();

  if (availableHints === 0) return null;

  return (
    <div className="sm:absolute sm:top-4 sm:left-0">
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer text-sm px-2 py-1 h-full"
              disabled={!gameId}
            >
              Hints ({hints.length}/{availableHints})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Hints ({hints.length}/{availableHints})
              </DialogTitle>
              <DialogDescription>
                You have revealed <Bold>{hints.length}</Bold> out of{' '}
                <Bold>{availableHints}</Bold> available{' '}
                {availableHints === 1 ? 'hint' : 'hints'} for this darts player.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              {hints.map((hint, index) => (
                <Hint
                  key={hint.createdAt.toString()}
                  type="revealed"
                  hint={hint}
                  hintNo={index + 1}
                />
              ))}
              {obfuscatedHints.map((hint, index) => {
                if (index === 0) {
                  return (
                    <RevealHintForm
                      key={hint[0] + index}
                      hint={hint}
                      hintNo={index + 1 + hints.length}
                      gameId={gameId}
                    />
                  );
                } else {
                  return (
                    <Hint
                      key={hint[0] + index}
                      type="notRevealed"
                      hint={hint}
                      hintNo={index + 1 + hints.length}
                    />
                  );
                }
              })}
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

type HintProps =
  | {
      type: 'revealed';
      hint: GameHint;
      hintNo: number;
    }
  | { type: 'notRevealed'; hint: string; hintNo: number };

function Hint({ type, hint, hintNo }: HintProps) {
  return (
    <div
      className={cn(
        'relative flex ring-2 px-4 py-4 rounded-md',
        type === 'revealed' ? 'ring-good-guess/25' : 'ring-wrong-guess/25'
      )}
    >
      <span
        className={cn(
          'absolute -right-3.5 -top-4 text-lg rounded-full px-2.5 z-1',
          type === 'revealed'
            ? 'bg-good-guess text-good-guess-foreground'
            : 'bg-wrong-guess text-wrong-guess-foreground'
        )}
      >
        {hintNo}
      </span>
      {type === 'revealed' && (
        <span className="absolute right-0.5 bottom-0 text-[0.6rem] text-accent-foreground">
          by {hint.user ? hint.user.name : <DeletedUser />} (
          {formatDistanceToNowStrict(hint.createdAt, {
            addSuffix: true,
          })}
          )
        </span>
      )}
      <p
        className={cn(
          'font-mono text-sm sm:text-base',
          type === 'revealed' ? null : 'blur-xs select-none'
        )}
      >
        {type === 'revealed' ? hint.hint : hint}
      </p>
    </div>
  );
}
