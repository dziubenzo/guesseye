type ConfirmationEmail = {
  name: string;
  url: string;
};

export default function ConfirmationEmail({ name, url }: ConfirmationEmail) {
  return (
    <div>
      <h2>Welcome, {name}!</h2>
      <p>Thank you for creating your GuessEye account.</p>
      <p>
        Click <a href={url}>here</a> to verify your account.
      </p>
      <p>The confirmation link is valid for 1 hour.</p>
    </div>
  );
}
