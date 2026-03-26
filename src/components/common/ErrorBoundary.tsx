import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/telemetry-client';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Shown in the fallback UI heading */
  label?: string;
  /** Compact inline fallback instead of full-page */
  inline?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    trackEvent('error_boundary_caught', {
      label: this.props.label ?? 'unknown',
      errorMessage: error.message,
      componentStack: info.componentStack?.slice(0, 500),
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.inline) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">
                {this.props.label ?? 'Something'} failed to load
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {this.state.error?.message}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={this.handleReset}
                className="mt-2"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    );
  }
}
