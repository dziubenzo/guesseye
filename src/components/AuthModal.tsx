'use client';

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
import { signIn } from '@/lib/auth-client';
import { signupSchema } from '@/lib/zod/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { z } from 'zod';

export default function AuthModal() {
  const loginForm = useForm();
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  function onLogin() {
    return;
  }

  function onSignup(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }

  async function handleGoogleLogin() {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
      errorCallbackURL: '/',
      newUserCallbackURL: '/',
    });
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
        <TabsContent value="login">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">
              Log in to GuessEye
            </DialogTitle>
            <Button
              variant="default"
              className="cursor-pointer text-lg gap-2 py-6"
              onClick={handleGoogleLogin}
            >
              Log In With <FaGoogle />
            </Button>
            <Separator className="my-3" />
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
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
                <Button
                  type="submit"
                  variant="secondary"
                  className="cursor-pointer mt-3 text-lg w-full hover:bg-primary hover:text-secondary"
                >
                  Log In
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </TabsContent>
        <TabsContent value="signup">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">
              Create GuessEye Account
            </DialogTitle>
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
                        <Input {...field} />
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
                <Button
                  type="submit"
                  className="cursor-pointer mt-3 text-lg w-full"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
