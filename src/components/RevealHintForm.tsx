'use client';

import Bold from '@/components/Bold';
import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn, getRandomDartsFact } from '@/lib/utils';
import {
  revealHintSchema,
  type RevealHintSchemaType,
} from '@/lib/zod/reveal-hint';
import { revealHint } from '@/server/actions/reveal-hint';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type RevealHintFormProps = {
  hintNo: number;
  gameId: number;
};

export default function RevealHintForm({
  hintNo,
  gameId,
}: RevealHintFormProps) {
  const revealHintForm = useForm<RevealHintSchemaType>({
    resolver: zodResolver(revealHintSchema),
    defaultValues: {
      gameId,
    },
  });

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(revealHint, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.error);
        return;
      }
    },
  });

  function onSubmit(values: RevealHintSchemaType) {
    setError('');
    execute(values);
  }

  return (
    <div>
      <div
        className={cn(
          'relative flex ring-2 px-4 py-4 rounded-md',
          'ring-wrong-guess/25 hover:ring-good-guess/25'
        )}
      >
        <span
          className={cn(
            'absolute -right-3.5 -top-4 text-lg rounded-full px-2.5 z-1',
            'bg-wrong-guess text-wrong-guess-foreground'
          )}
        >
          {hintNo}
        </span>
        <p className={cn('text-sm sm:text-base', 'blur-xs select-none')}>
          {getRandomDartsFact()}
        </p>
        <Form {...revealHintForm}>
          <form onSubmit={revealHintForm.handleSubmit(onSubmit)}>
            <Button
              type="submit"
              variant="ghost"
              className="absolute top-0 left-0 w-full h-full cursor-pointer text-2xl hover:bg-good-guess dark:hover:bg-good-guess dark:hover:text-secondary"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin size-7 h-full" />
              ) : (
                <Bold>REVEAL HINT {hintNo}</Bold>
              )}
            </Button>
          </form>
        </Form>
      </div>
      {error && (
        <div className="mt-5" onClick={() => setError('')}>
          <Message type="error">
            <p>{error}</p>
          </Message>
        </div>
      )}
    </div>
  );
}
