'use client';

import ErrorMessage from '@/components/ErrorMessage';
import ForgotPassword from '@/components/ForgotPassword';
import SignupSuccess from '@/components/SignupSuccess';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/lib/game-store';
import { loginSchema, LoginSchemaType } from '@/lib/zod/login';
import { signupSchema, SignupSchemaType } from '@/lib/zod/signup';
import { logInWithEmail } from '@/server/actions/log-in-with-email';
import { logInWithGoogle } from '@/server/actions/log-in-with-google';
import { signUpWithEmail } from '@/server/actions/sign-up-with-email';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

export default function AuthModal() {
  const [signupSuccess, setSignupSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword)
    return (
      <DialogContent>
        <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
      </DialogContent>
    );

  if (signupSuccess) {
    return (
      <DialogContent>
        <SignupSuccess email={signupSuccess} />
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <Tabs defaultValue="login" className="gap-5 mt-5">
        <TabsList className="w-full">
          <TabsTrigger value="login" className="cursor-pointer">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="cursor-pointer">
            Sign Up
          </TabsTrigger>
        </TabsList>
        <LoginTab setShowForgotPassword={setShowForgotPassword} />
        <SignupTab setSignupSuccess={setSignupSuccess} />
      </Tabs>
    </DialogContent>
  );
}

type LoginTabProps = {
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
};

function LoginTab({ setShowForgotPassword }: LoginTabProps) {
  const loginForm = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });
  const { resetState } = useGameStore();

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(logInWithEmail, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      resetState();
    },
  });

  function onLogin(values: LoginSchemaType) {
    setError('');
    execute(values);
  }

  return (
    <TabsContent value="login">
      <DialogHeader>
        <DialogTitle className="text-xl mb-4">Log in to GuessEye</DialogTitle>
      </DialogHeader>
      <GoogleLogin />
      <Separator className="my-3" />
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@example.com"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <ErrorMessage errorMessage={error} />}
          <Button
            type="submit"
            variant="secondary"
            className="cursor-pointer mt-3 text-lg w-full hover:bg-primary hover:text-secondary"
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
      </Form>
      <Button
        variant="link"
        className="cursor-pointer flex justify-self-end p-0 mt-2"
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot your password?
      </Button>
    </TabsContent>
  );
}

function GoogleLogin() {
  const router = useRouter();

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(logInWithGoogle, {
    onSuccess({ data }) {
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success?.url) {
        router.push(data.success.url);
      }
    },
  });

  function onGoogleLogin() {
    setError('');
    execute();
  }

  return (
    <>
      <Button
        variant="default"
        className={`cursor-pointer text-lg gap-2 py-6 w-full ${error ? 'mb-3' : undefined}`}
        disabled={isPending}
        onClick={onGoogleLogin}
      >
        {isPending && <Loader2 className="animate-spin" />}
        {isPending ? 'Redirecting to Google...' : `Log In With Google`}
        <FcGoogle />
      </Button>
      {error && <ErrorMessage errorMessage={error} />}
    </>
  );
}

type SignupTabProps = {
  setSignupSuccess: Dispatch<SetStateAction<string>>;
};

function SignupTab({ setSignupSuccess }: SignupTabProps) {
  const signupForm = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(signUpWithEmail, {
    onSuccess({ data, input }) {
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.success) {
        setSignupSuccess(input.email);
        return;
      }
    },
  });

  function onSignup(values: SignupSchemaType) {
    setSignupSuccess('');
    setError('');
    execute(values);
  }

  return (
    <TabsContent value="signup">
      <DialogHeader>
        <DialogTitle className="text-xl mb-4">
          Create GuessEye Account
        </DialogTitle>
      </DialogHeader>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSignup)}
          className="space-y-4"
        >
          <FormField
            control={signupForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Name</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={32} />
                </FormControl>
                {!signupForm.formState.errors?.name && (
                  <FormDescription>
                    Your name will be used for leaderboards.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@example.com"
                    {...field}
                    type="email"
                  />
                </FormControl>
                {!signupForm.formState.errors?.email && (
                  <FormDescription>
                    Your will receive a verification email.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <ErrorMessage errorMessage={error} />}
          <Button
            type="submit"
            className="cursor-pointer mt-3 text-lg w-full"
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
