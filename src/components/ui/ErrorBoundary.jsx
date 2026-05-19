import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("ErrorBoundary caught an error:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="empty-state surface-panel">
        <p>Something went wrong.</p>
        {this.props.onRetry && (
          <button type="button" className="btn mt-4" onClick={this.handleRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }
}
