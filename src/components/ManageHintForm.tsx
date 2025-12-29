'use client';

import Bold from '@/components/Bold';
import DeletedUser from '@/components/DeletedUser';
import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { SuggestedHint } from '@/lib/types';
import {
  manageHintSchema,
  type ManageHintSchemaType,
} from '@/lib/zod/manage-hint';
import { manageHint } from '@/server/actions/manage-hint';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNowStrict } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ManageHintFormProps = {
  hint: SuggestedHint;
};

export default function ManageHintForm({ hint }: ManageHintFormProps) {
  const manageHintForm = useForm<ManageHintSchemaType>({
    resolver: zodResolver(manageHintSchema),
    defaultValues: {
      action: 'edit',
      hintId: hint.id,
      hint: hint.hint,
    },
  });

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(manageHint, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
    },
  });

  function onSubmit(values: ManageHintSchemaType) {
    setError('');
    execute(values);
  }

  return (
    <Form {...manageHintForm}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:p-4 sm:ring-1 sm:ring-secondary-foreground/10 sm:rounded-md">
        <div className="flex flex-col gap-2 grow-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <Bold>
              {hint.fullName} ({hint.approvedHintsCount})
            </Bold>
            <span className="text-xs">
              by {hint.addedBy ? hint.addedBy : <DeletedUser />},{' '}
              {formatDistanceToNowStrict(hint.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
          <form>
            <FormField
              control={manageHintForm.control}
              name="hint"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 text-sm">
                  <Textarea minLength={8} {...field} />
                </FormItem>
              )}
            />
          </form>
          {error && (
            <Message type="error">
              <p>{error}</p>
            </Message>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            type="submit"
            variant={'default'}
            size={'lg'}
            disabled={isPending}
            className="cursor-pointer"
            onClick={manageHintForm.handleSubmit((values) =>
              onSubmit({ ...values, action: 'edit' })
            )}
          >
            <Check size={32} />
          </Button>
          <Button
            type="submit"
            variant={'destructive'}
            size={'lg'}
            disabled={isPending}
            className="cursor-pointer"
            onClick={manageHintForm.handleSubmit((values) =>
              onSubmit({ ...values, action: 'delete' })
            )}
          >
            <X size={32} />
          </Button>
        </div>
      </div>
    </Form>
  );
}
