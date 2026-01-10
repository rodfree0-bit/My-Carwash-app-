import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from '../services/Logger';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    props!: Readonly<Props>;

    state: State = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        Logger.error('Global Crash Caught', { error: error.toString(), info: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-white/10 text-center">
                        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error_outline</span>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-slate-400 mb-6">We encountered an unexpected error. Please try reloading the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-black font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            Reload Application
                        </button>
                        {this.state.error && (
                            <div className="mt-8 p-4 bg-black/50 rounded-lg text-left overflow-auto max-h-40 w-full">
                                <p className="text-xs font-mono text-red-300 break-words">{this.state.error.toString()}</p>
                                <p className="text-[10px] font-mono text-slate-500 mt-2 break-all">{this.state.error.stack?.slice(0, 200)}...</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const { children } = this.props;
        return children;
    }
}
