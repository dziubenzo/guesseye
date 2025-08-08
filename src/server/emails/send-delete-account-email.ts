'use server';

import DeleteAccountEmail from '@/components/DeleteAccountEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendDeleteAccountEmail = async (
  email: string,
  name: string,
  url: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <oche@guesseye.com>',
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
