import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where, limit } from 'firebase/firestore';
import { db } from '../firebase';

interface Message {
    id?: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'admin' | 'washer';
    message: string;
    timestamp: any;
    read: boolean;
}

interface SupportTicket {
    id: string;
    userId: string; // Changed from clientId to generic userId
    userRole: 'client' | 'washer'; // New field
    userName: string; // Changed from clientName
    userEmail: string; // Changed from clientEmail
    status: 'open' | 'closed';
    source?: string; // New field for origin (e.g., "Landing Page - LA")
    createdAt: any;
    lastMessageAt: any;
    unreadByClient: number; // This tracks unread by the user (client or washer)
    unreadByAdmin: number;
}

interface SupportChatAdminProps {
    currentUser: any;
    navigate: (screen: any) => void;
}

export const SupportChatAdmin: React.FC<SupportChatAdminProps> = ({ currentUser, navigate }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load all tickets
    useEffect(() => {
        const ticketsRef = collection(db, 'supportTickets');
        // Fetch all tickets to ensure resilience if 'status' field is missing in some docs
        const q = query(ticketsRef, limit(100));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketsData = snapshot.docs.map(doc => {
                const data = doc.data();
                // Binary status mapping: if it's not explicitly 'closed', it must be 'open'
                const status = data.status === 'closed' ? 'closed' : 'open';
                return {
                    id: doc.id,
                    ...data,
                    status
                } as SupportTicket;
            });
            // Sort by lastMessageAt desc
            setTickets(ticketsData.sort((a, b) => (b.lastMessageAt?.toMillis?.() || 0) - (a.lastMessageAt?.toMillis?.() || 0)));
        });

        return () => unsubscribe();
    }, []); // No dependency on filter here, we filter in memory now

    // Load messages for selected ticket
    useEffect(() => {
        if (!selectedTicketId) {
            setMessages([]);
            return;
        }

        const messagesRef = collection(db, 'supportTickets', selectedTicketId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            // Sort by timestamp asc
            setMessages(msgs.sort((a, b) => (a.timestamp?.toMillis?.() || 0) - (b.timestamp?.toMillis?.() || 0)));
            scrollToBottom();

            // Mark user messages as read
            const unreadClientMessages = snapshot.docs.filter(doc => {
                const msg = doc.data();
                return (msg.senderRole === 'client' || msg.senderRole === 'washer') && !msg.read;
            });

            for (const msgDoc of unreadClientMessages) {
                await updateDoc(doc(db, 'supportTickets', selectedTicket.id, 'messages', msgDoc.id), {
                    read: true
                });
            }

            // Update ticket's unread count
            if (unreadClientMessages.length > 0) {
                await updateDoc(doc(db, 'supportTickets', selectedTicketId), {
                    unreadByAdmin: 0,
                    status: 'open' // Explicitly keep open when messages are being read (unless closed)
                });
            }
        });

        return () => unsubscribe();
    }, [selectedTicketId]); // Depend on ID for stability

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedTicket || !currentUser) return;

        try {
            await addDoc(collection(db, 'supportTickets', selectedTicket.id, 'messages'), {
                senderId: currentUser.id,
                senderName: currentUser.name || 'Admin',
                senderRole: 'admin',
                message: newMessage.trim(),
                timestamp: serverTimestamp(),
                read: false
            });

            // Update ticket's last message time and unread count for client
            const clientUnreadCount = messages.filter(m => m.senderRole === 'admin' && !m.read).length + 1;
            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                lastMessageAt: serverTimestamp(),
                unreadByClient: clientUnreadCount,
                status: 'open' // Force open on any response
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleCloseTicket = async () => {
        if (!selectedTicket) return;

        try {
            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                status: 'closed'
            });
            setSelectedTicketId(null);
        } catch (error) {
            console.error('Error closing ticket:', error);
        }
    };

    const handleReopenTicket = async () => {
        if (!selectedTicket) return;

        try {
            await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
                status: 'open'
            });
        } catch (error) {
            console.error('Error reopening ticket:', error);
        }
    };

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp?.toDate) return '';
        const now = new Date();
        const then = timestamp.toDate();
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white relative">
            {/* Main Header - Only visible when NO ticket selected on mobile, or always on desktop */}
            <header className={`px-4 py-4 border-b border-white/10 flex items-center justify-between shrink-0 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {tickets.filter(t => t.status === 'open').length} open tickets
                    </p>
                </div>
                <button
                    onClick={() => navigate('ADMIN_DASHBOARD' as any)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Tickets List - Hidden on mobile when ticket selected */}
                <div className={`w-full md:w-80 border-r border-white/10 flex flex-col bg-background-dark absolute md:relative inset-0 z-10 md:z-auto transition-transform duration-300 ${selectedTicket ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>

                    {/* Filters */}
                    <div className="p-3 border-b border-white/10 flex gap-2 shrink-0">
                        {(['all', 'open', 'closed'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 ${filter === f
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Tickets */}
                    <div className="flex-1 overflow-y-auto">
                        {tickets.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inbox</span>
                                <p className="text-sm">No tickets found</p>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`w-full p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left ${selectedTicketId === ticket.id ? 'bg-white/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm truncate text-white">{ticket.userName || 'Guest User'}</h3>
                                                {ticket.userRole === 'washer' && (
                                                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">WASHER</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate">{ticket.userEmail || 'No contact info'}</p>
                                            {ticket.source && (
                                                <p className="text-[10px] text-primary/80 mt-0.5 truncate flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">public</span>
                                                    {ticket.source}
                                                </p>
                                            )}
                                        </div>
                                        {ticket.unreadByAdmin > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                                                {ticket.unreadByAdmin}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'open'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {getTimeAgo(ticket.lastMessageAt)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area - Full screen mobile overlay when active */}
                <div className={`flex-1 flex flex-col bg-background-dark absolute md:relative inset-0 z-20 md:z-auto transition-transform duration-300 ${selectedTicket ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between bg-surface-dark shrink-0 shadow-md md:shadow-none">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {/* Back Button Mobile */}
                                    <button
                                        onClick={() => setSelectedTicketId(null)}
                                        className="md:hidden p-2 -ml-2 text-white/80 hover:text-white"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold truncate">{selectedTicket.userName || 'Guest User'}</h2>
                                            {selectedTicket.userRole === 'washer' && (
                                                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">WASHER</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">{selectedTicket.userEmail || 'No contact info'}</p>
                                        {selectedTicket.source && (
                                            <p className="text-[10px] text-primary/80 flex items-center gap-1 mt-0.5">
                                                <span className="material-symbols-outlined text-[10px]">public</span>
                                                {selectedTicket.source}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0 ml-2">
                                    {selectedTicket.status === 'open' ? (
                                        <button
                                            onClick={handleCloseTicket}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-green-500/20 text-green-400 rounded-lg text-xs md:text-sm font-bold hover:bg-green-500/30 transition-colors flex items-center gap-1 md:gap-2 whitespace-nowrap"
                                        >
                                            <span className="material-symbols-outlined text-sm md:text-base">check_circle</span>
                                            <span className="hidden sm:inline">Close Ticket</span>
                                            <span className="sm:hidden">Close</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleReopenTicket}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/20 text-amber-400 rounded-lg text-xs md:text-sm font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1 md:gap-2 whitespace-nowrap"
                                        >
                                            <span className="material-symbols-outlined text-sm md:text-base">refresh</span>
                                            <span className="hidden sm:inline">Reopen</span>
                                            <span className="sm:hidden">Open</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark scroll-smooth">
                                {messages.map((msg) => {
                                    const isMyMessage = msg.senderRole === 'admin';
                                    const isSystem = msg.senderId === 'system';

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] md:max-w-md px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${isSystem
                                                    ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                                                    : isMyMessage
                                                        ? 'bg-primary text-white rounded-br-sm'
                                                        : 'bg-surface-dark text-white border border-white/10 rounded-bl-sm'
                                                    }`}
                                            >
                                                {!isMyMessage && !isSystem && (
                                                    <p className="text-xs font-bold text-primary mb-1">
                                                        {msg.senderName}
                                                    </p>
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

                            {/* Input - Only if not closed */}
                            {selectedTicket.status !== 'closed' && (
                                <div className="p-3 md:p-4 border-t border-white/10 bg-surface-dark safe-area-bottom">
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
                                            placeholder="Type response..."
                                            rows={1}
                                            className="flex-1 bg-background-dark text-white px-4 py-3 rounded-2xl border border-white/10 focus:border-primary focus:outline-none placeholder-slate-500 resize-none min-h-[44px] max-h-[120px] text-base"
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
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 hidden md:flex">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">chat</span>
                                <p>Select a ticket to view conversation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
