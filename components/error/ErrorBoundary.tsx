"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="mb-4">
                We're sorry, but there was an error rendering this component.
                Please try refreshing the page or contact support if the issue
                persists.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="button -md -purple-1 text-white"
                >
                  Refresh Page
                </button>
                <Link href="/">
                  <button className="button -md -outline-purple-1 text-purple-1">
                    Go to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
