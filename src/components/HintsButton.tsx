'use client';

import Bold from '@/components/Bold';
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
import { cn, getRandomDartsFact } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';

type HintsButtonType = {
  availableHints: number;
  gameId?: number;
};

export default function HintsButton({
  availableHints,
  gameId,
}: HintsButtonType) {
  const { hints } = useGameStore();

  const hintsLeft = availableHints - hints.length;

  if (availableHints === 0 || !gameId) return null;

  const hintsLeftArray = new Array(hintsLeft).fill(undefined);

  return (
    <div className="sm:absolute sm:top-4 sm:left-0">
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer text-sm px-2 py-1 h-full"
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
                  hintNo={index + 1}
                  hint={hint}
                />
              ))}
              {hintsLeftArray.map((_, index) => {
                if (index === 0) {
                  return (
                    <RevealHintForm
                      key={crypto.randomUUID()}
                      hintNo={index + 1 + hints.length}
                      gameId={gameId}
                    />
                  );
                } else {
                  return (
                    <Hint
                      key={crypto.randomUUID()}
                      type="notRevealed"
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
  | { type: 'notRevealed'; hintNo: number };

function Hint(props: HintProps) {
  const { type, hintNo } = props;

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
          added{' '}
          {formatDistanceToNowStrict(props.hint.createdAt, {
            addSuffix: true,
          })}
        </span>
      )}
      <p
        className={cn(
          'text-sm sm:text-base',
          type === 'revealed' ? null : 'blur-xs select-none'
        )}
      >
        {type === 'revealed' ? props.hint.hint : getRandomDartsFact()}
      </p>
    </div>
  );
}
