import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  sendResetEmailSchema,
  SendResetEmailSchemaType,
} from '@/lib/zod/send-reset-email';
import { sendResetEmail } from '@/server/actions/send-reset-email';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveLeft } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

type ForgotPasswordProps = {
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
};

export default function ForgotPassword({
  setShowForgotPassword,
}: ForgotPasswordProps) {
  const forgotPasswordForm = useForm<SendResetEmailSchemaType>({
    resolver: zodResolver(sendResetEmailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, isPending } = useAction(sendResetEmail, {
    onSuccess({ data, input }) {
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        setSuccess(`A reset password link has been sent to ${input.email}.`);
        return;
      }
    },
  });

  function onSubmit(values: SendResetEmailSchemaType) {
    setError('');
    execute(values);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Forgot Your Password?</DialogTitle>
        <DialogDescription>
          If you forgot your password, enter your email address. You will
          receive a reset password link where you can change your password.
        </DialogDescription>
      </DialogHeader>
      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={forgotPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    type="email"
                    disabled={success ? true : false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <ErrorMessage errorMessage={error} />}
          {success && <SuccessMessage successMessage={success} />}
          {!success && (
            <Button
              type="submit"
              className={`cursor-pointer w-full mb-3 text-lg ${error || success ? 'mt-3' : undefined}`}
              disabled={isPending}
            >
              {isPending ? 'Sending Reset Email...' : 'Send Reset Email'}
            </Button>
          )}
          <Button
            variant="ghost"
            className="cursor-pointer w-full mt-3"
            onClick={() => setShowForgotPassword(false)}
          >
            <MoveLeft />
            <span className="sr-only">Go Back To Log In</span>
          </Button>
        </form>
      </Form>
    </>
  );
}
