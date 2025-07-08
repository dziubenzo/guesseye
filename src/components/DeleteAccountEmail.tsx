type DeleteAccountEmail = {
  name: string;
  url: string;
};

export default function DeleteAccountEmail({ name, url }: DeleteAccountEmail) {
  return (
    <div>
      <h2>Hi, {name}!</h2>
      <p>It looks like you have requested to delete your GuessEye account.</p>
      <p>
        Click <a href={url}>here</a> to confirm the deletion of your account.
      </p>
      <p>The link is valid for 15 minutes.</p>
    </div>
  );
}
