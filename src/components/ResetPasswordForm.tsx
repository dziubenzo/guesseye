'use client';

import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/auth-client';
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/lib/zod/reset-password';
import { resetPasswordAction } from '@/server/actions/reset-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { notFound, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordForm() {
  const { data } = useSession();
  const searchParams = useSearchParams();
  const resetPasswordForm = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
      token: searchParams.get('token') || '',
    },
    mode: 'onBlur',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, isPending } = useAction(resetPasswordAction, {
    onSuccess({ data }) {
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        setSuccess('Password updated successfully!');
        return;
      }
    },
  });

  function onSubmit(values: ResetPasswordSchemaType) {
    setError('');
    execute(values);
  }

  if (data || (!data && !searchParams.has('token'))) {
    return notFound();
  }

  if (!data && searchParams.has('token')) {
    return (
      <div className="flex flex-col grow-1 justify-center items-center">
        <Card className="w-max lg:w-[50%]">
          <CardHeader>
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password in the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...resetPasswordForm}>
              <form
                onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={resetPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="cursor-pointer">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="cursor-pointer">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Message type="error">
                    <p>{error}</p>
                  </Message>
                )}
                {success && (
                  <Message type="success">
                    <p>{success}</p>
                  </Message>
                )}
                {!success && !error && (
                  <Button
                    type="submit"
                    className="cursor-pointer mt-3 text-lg w-full hover:bg-primary hover:text-secondary"
                    disabled={isPending}
                  >
                    {isPending ? 'Updating Password...' : 'Update Password'}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
}
