import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    currentUserId: string;
    chatTitle: string;
    chatSubtitle?: string;
    onSendMessage: (content: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    onClose,
    messages,
    currentUserId,
    chatTitle,
    chatSubtitle,
    onSendMessage,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        onSendMessage(messageInput);
        setMessageInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-md h-[80vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
                            <span className="material-symbols-outlined text-primary">chat</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">{chatTitle}</h3>
                            {chatSubtitle && (
                                <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {chatSubtitle}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-slate-400">close</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark/50">
                    {messages.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">chat</span>
                            <p className="text-sm">Start the conversation</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.senderId === currentUserId
                                    ? 'bg-primary text-black rounded-tr-none'
                                    : 'bg-white/10 text-white rounded-tl-none'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.senderId === currentUserId ? 'text-black/50' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                    <button type="button" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                    </button>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-3 rounded-full bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors shadow-lg shadow-primary/10"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};
