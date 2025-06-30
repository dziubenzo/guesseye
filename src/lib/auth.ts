import { db } from '@/server/db/index';
import { sendConfirmationEmail } from '@/server/emails/send-confirmation-email';
import { sendResetPasswordEmail } from '@/server/emails/send-reset-password-email';
import * as dotenvx from '@dotenvx/dotenvx';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url);
    },
    resetPasswordTokenExpiresIn: 15 * 60,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendConfirmationEmail(user.email, user.name, url);
    },
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
  },
  socialProviders: {
    google: {
      clientId: dotenvx.get('GOOGLE_CLIENT_ID'),
      clientSecret: dotenvx.get('GOOGLE_CLIENT_SECRET'),
    },
  },
  advanced: {
    cookiePrefix: 'guesseye',
  },
  trustedOrigins: ['http://192.168.0.13:3000'],
});
