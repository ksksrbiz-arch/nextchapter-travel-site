/**
 * Form validation utilities for client-side validation
 */

export type ValidationRule = {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string;
  custom?: (value: any) => string | undefined;
};

export type ValidationRules = Record<string, ValidationRule>;

export type ValidationErrors = Record<string, string | undefined>;

/**
 * Validate a single field against rules
 */
export function validateField(
  value: any,
  rules?: ValidationRule
): string | undefined {
  if (!rules) return undefined;

  // Required validation
  if (rules.required) {
    if (!value || (typeof value === "string" && !value.trim())) {
      return typeof rules.required === "string"
        ? rules.required
        : "This field is required";
    }
  }

  // Skip other validations if field is not required and empty
  if (!value) return undefined;

  // Min length validation
  if (rules.minLength) {
    const config =
      typeof rules.minLength === "number"
        ? {
            value: rules.minLength,
            message: `Must be at least ${rules.minLength} characters`,
          }
        : rules.minLength;
    if (String(value).length < config.value) {
      return config.message;
    }
  }

  // Max length validation
  if (rules.maxLength) {
    const config =
      typeof rules.maxLength === "number"
        ? {
            value: rules.maxLength,
            message: `Must not exceed ${rules.maxLength} characters`,
          }
        : rules.maxLength;
    if (String(value).length > config.value) {
      return config.message;
    }
  }

  // Pattern validation
  if (rules.pattern) {
    const config =
      rules.pattern instanceof RegExp
        ? { value: rules.pattern, message: "Invalid format" }
        : rules.pattern;
    if (!config.value.test(String(value))) {
      return config.message;
    }
  }

  // Custom validation
  if (rules.validate) {
    const result = rules.validate(value);
    if (typeof result === "string") return result;
    if (!result) return "Validation failed";
  }

  // Custom function
  if (rules.custom) {
    return rules.custom(value);
  }

  return undefined;
}

/**
 * Validate multiple fields
 */
export function validateForm(
  formData: Record<string, any>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(formData[field], fieldRules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

/**
 * Common validation patterns
 */
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]{10,}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  numeric: /^[\d]*$/,
};

/**
 * Common validation rules
 */
export const COMMON_RULES = {
  email: {
    required: "Email is required",
    pattern: { value: PATTERNS.email, message: "Invalid email address" },
  },
  phone: {
    required: "Phone number is required",
    pattern: { value: PATTERNS.phone, message: "Invalid phone number" },
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    validate: (value: string) => {
      if (!/[A-Z]/.test(value))
        return "Must contain at least one uppercase letter";
      if (!/[a-z]/.test(value))
        return "Must contain at least one lowercase letter";
      if (!/[\d]/.test(value)) return "Must contain at least one number";
      return true;
    },
  },
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 100, message: "Name must not exceed 100 characters" },
  },
  message: {
    required: "Message is required",
    minLength: { value: 1, message: "Message cannot be empty" },
    maxLength: {
      value: 1000,
      message: "Message must not exceed 1000 characters",
    },
  },
};
