import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";

interface EnhancedInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Floating label text */
  label: string;
  /** Error message to display */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Helper text below input */
  helperText?: string;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Character count limit */
  maxLength?: number;
  /** Show character count */
  showCharCount?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Enhanced input with floating label, validation states, and smooth animations.
 *
 * @example
 * ```tsx
 * <EnhancedInput
 *   label="Email Address"
 *   type="email"
 *   error={errors.email}
 *   success={isEmailValid}
 *   leftIcon={<Mail className="w-4 h-4" />}
 * />
 * ```
 */
export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  function EnhancedInput(
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      maxLength,
      showCharCount,
      size = "md",
      type,
      className,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(
      String(value || defaultValue || "").length
    );

    const hasValue =
      value !== undefined ? String(value).length > 0 : charCount > 0;

    const isFloating = isFocused || hasValue;
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const sizeClasses = {
      sm: "h-10 text-sm",
      md: "h-12 text-base",
      lg: "h-14 text-lg",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "relative rounded-xl border transition-all duration-200",
            sizeClasses[size],
            isFocused && !error
              ? "border-secondary ring-2 ring-secondary/20"
              : error
                ? "border-red-500 ring-2 ring-red-500/20"
                : success
                  ? "border-green-500"
                  : "border-border hover:border-foreground/30"
          )}
        >
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full h-full bg-transparent px-4 pt-4 pb-1 font-sans text-foreground placeholder:text-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (isPassword || success || error) && "pr-10"
            )}
            placeholder={label}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${props.id}-error`
                : helperText
                  ? `${props.id}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Floating label */}
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none font-sans",
              leftIcon && "left-10",
              isFloating
                ? cn(
                    "top-1.5 text-xs",
                    isFocused ? "text-secondary" : "text-muted-foreground"
                  )
                : cn(
                    "top-1/2 -translate-y-1/2",
                    labelSizes[size],
                    "text-muted-foreground"
                  ),
              error && "text-red-500"
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>

          {/* Right icons (password toggle, success, error) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {success && !error && (
              <Check className="w-4 h-4 text-green-500 animate-in zoom-in-50 duration-200" />
            )}
            {error && (
              <AlertCircle className="w-4 h-4 text-red-500 animate-shake" />
            )}
          </div>
        </div>

        {/* Helper text / Error / Character count */}
        <div className="flex justify-between mt-1.5 px-1">
          <div className="flex-1">
            {error ? (
              <p
                id={`${props.id}-error`}
                className="text-xs text-red-500 font-sans animate-in slide-in-from-top-1 duration-200"
              >
                {error}
              </p>
            ) : helperText ? (
              <p
                id={`${props.id}-helper`}
                className="text-xs text-muted-foreground font-sans"
              >
                {helperText}
              </p>
            ) : null}
          </div>
          {showCharCount && maxLength && (
            <p
              className={cn(
                "text-xs font-sans transition-colors",
                charCount >= maxLength
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

/**
 * Animated form success state
 */
export function FormSuccess({
  message = "Success!",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <p className="text-sm font-sans text-green-700 dark:text-green-400">
        {message}
      </p>
    </div>
  );
}

/**
 * Animated form error state
 */
export function FormError({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertCircle className="w-4 h-4 text-red-600" />
      </div>
      <p className="text-sm font-sans text-red-700 dark:text-red-400">
        {message}
      </p>
    </div>
  );
}
