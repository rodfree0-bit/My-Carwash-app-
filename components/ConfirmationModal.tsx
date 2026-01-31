import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'primary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'primary'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[#1a2431] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-3xl">
                            {type === 'danger' ? 'warning' : 'help'}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-3.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
