import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormFieldErrorProps {
  message?: string;
  show?: boolean;
  className?: string;
}

export function FormFieldError({
  message,
  show = true,
  className = "",
}: FormFieldErrorProps) {
  if (!show || !message) return null;

  return (
    <div
      className={`flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface FormFieldSuccessProps {
  message?: string;
  show?: boolean;
  className?: string;
}

export function FormFieldSuccess({
  message,
  show = true,
  className = "",
}: FormFieldSuccessProps) {
  if (!show || !message) return null;

  return (
    <div
      className={`flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-1 ${className}`}
    >
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface FormFieldWrapperProps {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  helpText?: string;
}

export function FormFieldWrapper({
  label,
  error,
  success,
  required,
  children,
  className = "",
  helpText,
}: FormFieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && !success && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && <FormFieldError message={error} />}
      {!error && success && <FormFieldSuccess message={success} />}
    </div>
  );
}

interface FormErrorSummaryProps {
  errors: Record<string, string | undefined>;
  title?: string;
  className?: string;
}

export function FormErrorSummary({
  errors,
  title = "Please fix the following errors:",
  className = "",
}: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, msg]) => msg);

  if (errorEntries.length === 0) return null;

  return (
    <div
      className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 dark:text-red-200 text-sm mb-2">
            {title}
          </h3>
          <ul className="space-y-1">
            {errorEntries.map(([field, message]) => (
              <li
                key={field}
                className="text-sm text-red-700 dark:text-red-300"
              >
                <span className="font-medium capitalize">
                  {field.replace(/([A-Z])/g, " $1").trim()}:
                </span>{" "}
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
