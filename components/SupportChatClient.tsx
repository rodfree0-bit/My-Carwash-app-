import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, where, limit, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Message {
    id?: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'admin';
    message: string;
    timestamp: any;
    read: boolean;
}

interface SupportTicket {
    id?: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    status: 'open' | 'closed';
    createdAt: any;
    lastMessageAt: any;
    unreadByClient: number;
    unreadByAdmin: number;
    source?: string;
    userRole?: 'client' | 'washer';
}

interface SupportChatClientProps {
    currentUser: any;
    onClose: () => void;
}

export const SupportChatClient: React.FC<SupportChatClientProps> = ({ currentUser, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const loadTicket = async () => {
            // Set a safety timeout to ensure we don't stay in loading forever
            const timeoutId = setTimeout(() => {
                if (loading) setLoading(false);
            }, 5000);

            try {
                // Check if user has an open ticket
                const ticketsRef = collection(db, 'supportTickets');
                const q = query(
                    ticketsRef,
                    where('clientId', '==', currentUser.id),
                    where('status', '==', 'open'),
                    limit(1)
                );

                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const ticketDoc = snapshot.docs[0];
                    setTicketId(ticketDoc.id);

                    // Mark messages as read by client
                    await updateDoc(doc(db, 'supportTickets', ticketDoc.id), {
                        unreadByClient: 0
                    });
                } else {
                    // Show ONLY local welcome message (fake)
                    setMessages([{
                        id: 'welcome',
                        senderId: 'system',
                        senderName: 'Technical Support',
                        senderRole: 'admin',
                        message: '👋 Hello! How can we help you today?',
                        timestamp: { toDate: () => new Date() },
                        read: false
                    }]);
                }
            } catch (error) {
                console.error('Error loading ticket:', error);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        loadTicket();
    }, [currentUser]);

    // Listen to messages ONLY if ticketId exists
    useEffect(() => {
        if (!ticketId) return;

        const messagesRef = collection(db, 'supportTickets', ticketId, 'messages');
        const q = query(messagesRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            // Sort by timestamp asc
            setMessages(msgs.sort((a, b) => (a.timestamp?.toMillis?.() || 0) - (b.timestamp?.toMillis?.() || 0)));
            scrollToBottom();

            // Mark admin messages as read
            snapshot.docs.forEach(async (msgDoc) => {
                const msg = msgDoc.data();
                if (msg.senderRole === 'admin' && !msg.read) {
                    await updateDoc(doc(db, 'supportTickets', ticketId, 'messages', msgDoc.id), {
                        read: true
                    });
                }
            });
        }, (error) => {
            console.error('❌ Error listening to messages in SupportChatClient:', error);
        });

        return () => unsubscribe();
    }, [ticketId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !currentUser) return;

        const messageText = newMessage.trim();
        setNewMessage(''); // Clear immediately for UX

        try {
            let currentTicketId = ticketId;

            // If no ticket exists yet, create it FIRST
            if (!currentTicketId) {
                const ticketsRef = collection(db, 'supportTickets');
                const newTicket: Omit<SupportTicket, 'id'> = {
                    clientId: currentUser.id,
                    clientName: currentUser.name || 'User',
                    clientEmail: currentUser.email || '',
                    status: 'open',
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    unreadByClient: 0,
                    unreadByAdmin: 1,
                    source: 'App - Client',
                    userRole: 'client'
                };

                const docRef = await addDoc(ticketsRef, newTicket);
                currentTicketId = docRef.id;
                setTicketId(currentTicketId);

                // Add initial Welcome Message to DB so it persists
                await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
                    senderId: 'system',
                    senderName: 'Technical Support',
                    senderRole: 'admin',
                    message: '👋 Hello! How can we help you today?',
                    timestamp: serverTimestamp(),
                    read: true // Read because user already saw it
                });
            }

            // Send actual user message
            await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
                senderId: currentUser.id,
                senderName: currentUser.name || 'User',
                senderRole: 'client',
                message: messageText,
                timestamp: serverTimestamp(),
                read: false
            });

            // Update ticket's last message time and unread count
            // Calculate unread count (fetching old count + 1 locally is approximate, better to just rely on cloud function or this update)
            await updateDoc(doc(db, 'supportTickets', currentTicketId), {
                lastMessageAt: serverTimestamp(),
                unreadByAdmin: 1, // Increment logic handled by backend usually, but here forcing 1 ensures visibility
                status: 'open'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally restore message if failed
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-surface-dark p-6 rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-white mt-4">Loading support chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background-dark md:bg-black/50 md:items-center md:justify-center">
            <div className="flex-1 w-full h-full md:w-full md:max-w-2xl md:h-[600px] flex flex-col bg-background-dark md:bg-surface-dark md:rounded-2xl md:shadow-2xl md:border md:border-white/10 relative">

                {/* Header Fixed Logic for Mobile */}
                <div className="bg-gradient-to-r from-primary to-purple-600 p-4 md:rounded-t-2xl flex justify-between items-center shrink-0 shadow-md z-10 safe-area-top">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">support_agent</span>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-white">Support</h2>
                            <p className="text-xs text-white/80">Online 24/7</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors touch-manipulation"
                        aria-label="Close chat"
                    >
                        <span className="material-symbols-outlined text-white text-2xl font-bold">close</span>
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark scroll-smooth overscroll-contain">
                    {messages.map((msg) => {
                        const isMyMessage = msg.senderRole === 'client';
                        const isSystem = msg.senderId === 'system';

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${isSystem
                                        ? 'bg-slate-700/50 text-slate-300 border border-slate-600 text-center mx-auto'
                                        : isMyMessage
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-surface-dark text-white border border-white/10 rounded-bl-sm'
                                        }`}
                                >
                                    {!isMyMessage && !isSystem && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-xs text-primary">support_agent</span>
                                            <p className="text-xs font-bold text-primary">
                                                {msg.senderName}
                                            </p>
                                        </div>
                                    )}
                                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                                    <p className="text-[10px] mt-1 opacity-70 text-right">
                                        {msg.timestamp?.toDate ?
                                            new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '...'
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed at Bottom */}
                <div className="p-3 md:p-4 bg-surface-dark border-t border-white/10 shrink-0 safe-area-bottom md:rounded-b-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10">
                    <div className="flex gap-2 items-end">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 bg-background-dark text-white px-4 py-3 rounded-2xl border border-white/10 focus:border-primary focus:outline-none placeholder-slate-500 resize-none min-h-[44px] max-h-[120px] text-base"
                            style={{ paddingBottom: '10px' }} // Fix visual alignment
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="bg-primary hover:bg-primary-dark disabled:bg-slate-700 disabled:cursor-not-allowed text-white w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all shadow-lg active:scale-95"
                        >
                            <span className="material-symbols-outlined text-xl">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
