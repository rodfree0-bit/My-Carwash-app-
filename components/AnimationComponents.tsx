import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    transitionKey: string;
    type?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom';
    duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    transitionKey,
    type = 'fade',
    duration = 300
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentKey, setCurrentKey] = useState(transitionKey);

    useEffect(() => {
        if (transitionKey !== currentKey) {
            // Fade out
            setIsVisible(false);

            // Wait for fade out, then change content and fade in
            const timeout = setTimeout(() => {
                setCurrentKey(transitionKey);
                setIsVisible(true);
            }, duration);

            return () => clearTimeout(timeout);
        } else {
            setIsVisible(true);
        }
    }, [transitionKey, currentKey, duration]);

    const getAnimationClass = () => {
        if (!isVisible) {
            return 'fade-out';
        }

        switch (type) {
            case 'slide-left':
                return 'slide-left';
            case 'slide-right':
                return 'slide-right';
            case 'slide-up':
                return 'slide-up';
            case 'slide-down':
                return 'slide-down';
            case 'zoom':
                return 'zoom-in';
            case 'fade':
            default:
                return 'fade-in';
        }
    };

    return (
        <div
            key={currentKey}
            className={getAnimationClass()}
            style={{
                animationDuration: `${duration}ms`,
                width: '100%',
                height: '100%'
            }}
        >
            {children}
        </div>
    );
};

// Loading component with animation
interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    type?: 'spinner' | 'dots' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text,
    type = 'spinner'
}) => {
    const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

    if (type === 'dots') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="dots-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
            </div>
        );
    }

    if (type === 'pulse') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className={`w-16 h-16 bg-primary rounded-full animate-pulse`}></div>
                {text && <p className="text-slate-400 text-sm">{text}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`spinner ${sizeClass}`}></div>
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    );
};

// Toast notification component
interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 3000
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onClose?.();
            }, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20 text-green-200';
            case 'error':
                return 'bg-red-500/10 border-red-500/20 text-red-200';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200';
            case 'info':
            default:
                return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'info';
        }
    };

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 
        flex items-center gap-3 
        px-4 py-3 rounded-xl border
        ${getTypeStyles()}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        shadow-lg backdrop-blur-sm
        max-w-md
      `}
        >
            <span className="material-symbols-outlined text-xl">{getIcon()}</span>
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onClose?.(), 300);
                }}
                className="material-symbols-outlined text-lg hover:opacity-70 transition-opacity"
            >
                close
            </button>
        </div>
    );
};

// Skeleton loader component
interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '20px',
    className = '',
    count = 1
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`skeleton ${className}`}
                    style={{ width, height }}
                />
            ))}
        </>
    );
};

// Animated button component
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    loading?: boolean;
    icon?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return 'bg-white/5 text-white hover:bg-white/10 border border-white/10';
            case 'ghost':
                return 'bg-transparent text-white hover:bg-white/5';
            case 'primary':
            default:
                return 'bg-primary text-black hover:bg-primary-dark shadow-lg shadow-primary/20';
        }
    };

    return (
        <button
            className={`
        btn-hover ripple-effect
        px-6 py-3 rounded-xl font-bold
        flex items-center justify-center gap-2
        transition-smooth
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles()}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <div className="spinner-sm"></div>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="material-symbols-outlined">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

// Animated card component
interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    className = '',
    onClick,
    hoverable = true
}) => {
    return (
        <div
            className={`
        bg-white/5 border border-white/10 rounded-xl p-4
        ${hoverable ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

// Success animation component
export const SuccessAnimation: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 scale-pop">
            <div className="relative">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 52 52">
                        <circle
                            className="stroke-green-500 fill-none"
                            strokeWidth="4"
                            cx="26"
                            cy="26"
                            r="24"
                        />
                        <path
                            className="stroke-green-500 fill-none draw-check"
                            strokeWidth="4"
                            strokeLinecap="round"
                            d="M14 27l8 8 16-16"
                        />
                    </svg>
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-full pulse-ring"></div>
            </div>
            <p className="text-green-400 font-bold text-lg">Success!</p>
        </div>
    );
};
