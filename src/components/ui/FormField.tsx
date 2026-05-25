import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-900">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-red-600 animate-fade-in"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1.5 text-xs text-navy-700/50">{hint}</p>
      )}
    </div>
  );
}

export function fieldClassName(hasError: boolean): string {
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-navy-900 outline-none transition-all placeholder:text-navy-700/40 focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-navy-800/15 focus:border-solar-500 focus:ring-solar-500/20"
  }`;
}
