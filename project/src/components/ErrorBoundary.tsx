import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}