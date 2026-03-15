import ErrorBoundary from "@/components/ErrorBoundary";
import { ReactNode } from "react";

/**
 * PortalPageWrapper component
 * Wraps all portal pages with error handling and fallback UI
 * Ensures consistent error handling across the entire portal
 */
interface PortalPageWrapperProps {
  children: ReactNode;
  pageName: string;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

export function PortalPageWrapper({
  children,
  pageName,
  fallback,
}: PortalPageWrapperProps) {
  const defaultFallback = (error: Error, reset: () => void) => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          We encountered an error loading the {pageName.toLowerCase()}. Please
          try refreshing the page.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => (window.location.href = "/portal")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Portal
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      context={`Portal: ${pageName}`}
      fallback={fallback || defaultFallback}
    >
      {children}
    </ErrorBoundary>
  );
}
