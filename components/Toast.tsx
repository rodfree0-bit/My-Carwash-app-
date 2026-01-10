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
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-500 text-black' :
                            toast.type === 'error' ? 'bg-red-500 text-white' :
                                toast.type === 'warning' ? 'bg-amber-500 text-white' :
                                    'bg-blue-500 text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined font-bold">
                            {
                                toast.type === 'success' ? 'check_circle' :
                                    toast.type === 'error' ? 'error' :
                                        toast.type === 'warning' ? 'warning' : 'info'
                            }
                        </span>
                        <p className="font-bold text-sm flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
