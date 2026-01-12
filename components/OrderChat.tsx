import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface OrderChatProps {
    orderId: string;
    currentUserId: string;
    currentUserName: string;
    otherUserId: string;
    otherUserName: string;
    messages: Message[];
    sendMessage: (senderId: string, receiverId: string, orderId: string, content: string, type?: 'text' | 'image') => Promise<void>;
    isOpen: boolean;
    onClose: () => void;
}

export const OrderChat: React.FC<OrderChatProps> = ({
    orderId,
    currentUserId,
    currentUserName,
    otherUserId,
    otherUserName,
    messages,
    sendMessage,
    isOpen,
    onClose
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter messages for this order
    const orderMessages = messages.filter(m => m.orderId === orderId);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [orderMessages.length]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        sendMessage(currentUserId, otherUserId, orderId, newMessage.trim());
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-surface-dark border-t border-white/10 rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">chat</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Chat with {otherUserName}</p>
                        <p className="text-[10px] text-slate-500">Order #{orderId.slice(-6)}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </button>
            </div>

            {/* Messages Container */}
            <div className="h-48 overflow-y-auto p-4 space-y-3 bg-black/20">
                {orderMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">forum</span>
                        <p className="text-sm text-slate-500">No messages yet</p>
                        <p className="text-xs text-slate-600">Send a message to start the conversation</p>
                    </div>
                ) : (
                    orderMessages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMe
                                    ? 'bg-primary text-white rounded-br-sm'
                                    : 'bg-white/10 text-white rounded-bl-sm'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/30 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
