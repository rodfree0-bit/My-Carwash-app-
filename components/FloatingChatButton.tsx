import React from 'react';

interface FloatingChatButtonProps {
    onClick: () => void;
    unreadCount?: number;
    label?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, unreadCount = 0, label = "Message" }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:bg-white/20 transition-all active:scale-95 group"
        >
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                </div>
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#101822] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Support</span>
                <span className="font-bold text-sm">{label}</span>
            </div>
        </button>
    );
};
