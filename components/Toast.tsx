import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastType } from '../types';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        // Try native toast first
        if (typeof window !== 'undefined' && window.Android?.showToast) {
            window.Android.showToast(message);
            return;
        }

        // Prevent duplicate messages
        setToasts(prev => {
            // Check if same message already exists
            const isDuplicate = prev.some(t => t.message === message && t.type === type);
            if (isDuplicate) {
                return prev;
            }

            const id = Date.now().toString();
            const newToast = { id, message, type };

            // Limit to max 3 toasts, remove oldest if needed
            const updatedToasts = prev.length >= 3 ? [...prev.slice(1), newToast] : [...prev, newToast];

            // Auto dismiss after 3 seconds
            setTimeout(() => {
                setToasts(current => current.filter(t => t.id !== id));
            }, 3000);

            return updatedToasts;
        });
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-[90%] sm:max-w-md">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto w-full p-3.5 rounded-2xl backdrop-blur-md shadow-lg border flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-500 ease-out ${toast.type === 'success'
                            ? 'bg-black/80 border-green-500/30 text-white' :
                            toast.type === 'error'
                                ? 'bg-black/80 border-red-500/30 text-white' :
                                toast.type === 'warning'
                                    ? 'bg-black/80 border-amber-500/30 text-white' :
                                    'bg-black/80 border-blue-500/30 text-white'
                            }`}
                        style={{
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        }}
                    >
                        <div className={`p-1.5 rounded-lg flex items-center justify-center ${toast.type === 'success' ? 'bg-white/10 text-white' :
                                toast.type === 'error' ? 'bg-red-400/20 text-red-400' :
                                    toast.type === 'warning' ? 'bg-amber-400/20 text-amber-400' :
                                        'bg-blue-400/20 text-blue-400'
                            }`}>
                            <span className="material-symbols-outlined text-[18px] opacity-80">
                                {
                                    toast.type === 'success' ? 'check_circle' :
                                        toast.type === 'error' ? 'error' :
                                            toast.type === 'warning' ? 'warning' : 'info'
                                }
                            </span>
                        </div>
                        <p className="text-[13px] font-semibold flex-1 leading-tight text-white/90">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px] opacity-40">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
