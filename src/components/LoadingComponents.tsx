import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`spinner ${sizeClass}`}></div>
        </div>
    );
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <div className={`skeleton ${className}`}></div>;
};

export const SkeletonCard = () => {
    return (
        <div className="bg-surface-dark rounded-xl p-4 border border-white/5 space-y-3">
            <SkeletonLoader className="h-4 w-3/4" />
            <SkeletonLoader className="h-4 w-1/2" />
            <SkeletonLoader className="h-20 w-full" />
        </div>
    );
};

export const TypingIndicator = () => {
    return (
        <div className="flex gap-1 p-3 bg-white/10 rounded-2xl w-fit">
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot"></div>
        </div>
    );
};

export const ConfettiEffect: React.FC<{ show: boolean }> = ({ show }) => {
    if (!show) return null;

    const colors = ['#3b82f6', '#ff00ff', '#ffff00', '#00ff00', '#ff0000'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: piece.color,
                        left: `${piece.left}%`,
                        top: '-10px',
                        animationDelay: `${piece.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};
