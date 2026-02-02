import React from 'react';
import { toast } from 'react-toastify';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Render error:', error, errorInfo);
    toast.error('Coś poszło nie tak. Spróbuj odświeżyć stronę.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-600">Wystąpił nieoczekiwany błąd.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
