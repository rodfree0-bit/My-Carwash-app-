import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-background-dark flex flex-col items-center justify-center z-50">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-white/60 text-sm">{message}</p>
        </div>
    );
};
