import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary to catch component errors gracefully
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `ErrorBoundary${this.props.context ? ` [${this.props.context}]` : ""} caught:`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full">
            {/* Error icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            {/* Error message */}
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-center mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground font-sans text-sm text-center mb-6">
              {this.state.error.message ||
                "An unexpected error occurred. Please try again."}
            </p>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans active:scale-98 transition-transform"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full font-sans active:scale-98 transition-transform"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer font-mono hover:text-foreground transition-colors">
                  🔧 Error details (dev only)
                </summary>
                <pre className="text-[10px] bg-muted p-3 mt-2 rounded overflow-auto max-h-48 text-foreground/70 font-mono border border-border">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
