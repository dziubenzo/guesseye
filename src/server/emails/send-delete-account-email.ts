'use server';

import DeleteAccountEmail from '@/components/DeleteAccountEmail';
import * as dotenvx from '@dotenvx/dotenvx';
import { Resend } from 'resend';

const resend = new Resend(dotenvx.get('RESEND_API_KEY'));

export const sendDeleteAccountEmail = async (
  email: string,
  name: string,
  url: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <onboarding@resend.dev>',
    to: email,
    subject: 'GuessEye - Delete Account',
    react: DeleteAccountEmail({ name, url }),
    text: `Hi, ${name}! It looks like you have requested to delete your GuessEye account. Click the following link to confirm the deletion of your account: ${url}. The link is valid for 15 minutes.`,
  });

  if (error) {
    return error;
  }

  return data;
};
