import { ReactNode } from 'react';

type FieldProps = { children: ReactNode; className?: string };

export function Field({ children, className }: FieldProps) {
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

type FieldNameProps = Pick<FieldProps, 'children'>;

export function FieldName({ children }: FieldNameProps) {
  return <p className="flex gap-2 items-center text-sm">{children}</p>;
}

type FieldValueProps = Pick<FieldProps, 'children'>;

export function FieldValue({ children }: FieldValueProps) {
  return (
    <p className="bg-secondary p-2 rounded-md w-full text-center min-h-[40px]">
      {children}
    </p>
  );
}
