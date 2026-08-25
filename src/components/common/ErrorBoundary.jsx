import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h1>Something went wrong</h1>
            <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
            {typeof window !== 'undefined' &&
              typeof window.location !== 'undefined' &&
              window.location.hostname !== 'localhost' === false &&
              this.state.error && (
                <details className="mt-3">
                  <summary>Error details (development only)</summary>
                  <pre className="mt-2 bg-light p-3 rounded overflow-auto">
                    {this.state.error.toString()}
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
