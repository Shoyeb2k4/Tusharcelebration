'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Client-side error boundary for isolating widget/section failures so one
 * broken panel doesn't blank the whole page. Route-level errors are handled
 * by Next.js `error.tsx` files.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset);
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <AlertTriangle className="mb-3 h-6 w-6 text-destructive" />
          <p className="text-sm font-medium">Something went wrong here.</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
