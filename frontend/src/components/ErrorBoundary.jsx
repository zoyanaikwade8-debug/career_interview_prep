import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto text-center">
            <h1 className="text-red-600 text-3xl font-bold mb-2">Oops!</h1>
            <p className="text-slate-900 text-lg font-medium mb-4">Something went wrong.</p>
            <p className="text-gray-500 text-sm mb-8">
              We're sorry, but an unexpected error occurred. Please try going back to the dashboard.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/dashboard';
              }}
              className="w-full bg-blue-600 text-white font-medium rounded-lg text-sm px-5 py-3 shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
            >
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
