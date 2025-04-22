import { ReactNode } from 'react';

type FieldProps = { children: ReactNode };

export function Field({ children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {children}
    </div>
  );
}

type FieldNameProps = FieldProps;

export function FieldName({ children }: FieldNameProps) {
  return <p className="flex gap-2 items-center">{children}</p>;
}

type FieldValueProps = FieldProps;

export function FieldValue({ children }: FieldValueProps) {
  return (
    <p className="text-lg bg-secondary p-2 rounded-md w-full text-center">
      {children}
    </p>
  );
}
