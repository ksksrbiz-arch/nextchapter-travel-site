import { useState, useCallback } from "react";
import { validateField } from "@/lib/validation";
import type { ValidationRule } from "@/lib/validation";

/**
 * Hook for managing form state with automatic validation
 */
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  rules?: Record<string, ValidationRule>
) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
      if (errors[field as string]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }

      // Validate field in real-time if rules exist
      if (rules && rules[field as string]) {
        const error = validateField(value, rules[field as string]);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    },
    [errors, rules]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      handleChange(field, value);
    },
    [handleChange]
  );

  const setFieldError = useCallback(
    (field: keyof T, error: string | undefined) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    []
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error);
  }, [errors]);

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    clearErrors,
    reset,
    hasErrors,
    setValues,
  };
}

/**
 * Hook for managing a single input field state with validation
 */
export function useField(initialValue: string = "", rule?: ValidationRule) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);

      // Clear error when user starts typing
      if (error) {
        setError(undefined);
      }

      // Validate in real-time
      if (rule) {
        const validationError = validateField(newValue, rule);
        setError(validationError);
      }
    },
    [error, rule]
  );

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
  }, [initialValue]);

  return {
    value,
    setValue,
    error,
    setError,
    handleChange,
    reset,
    bind: {
      value,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleChange(e.target.value),
    },
  };
}
