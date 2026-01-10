import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, where, limit, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FloatingChatButton } from './FloatingChatButton';

interface Message {
    id?: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'admin' | 'guest';
    message: string;
    timestamp: any;
    read: boolean;
}

interface GuestSupportChatProps {
    onClose: () => void;
}

export const GuestSupportChat: React.FC<GuestSupportChatProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Generate or retrieve a guest ID from localStorage to persist chat across reloads
    const [guestId] = useState(() => {
        const stored = localStorage.getItem('guest_support_id');
        if (stored) return stored;
        const newId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guest_support_id', newId);
        return newId;
    });

    useEffect(() => {
        const loadTicket = async () => {
            setLoading(true);
            try {
                // Check if this guest already has an open ticket
                const ticketsRef = collection(db, 'supportTickets');
                const q = query(
                    ticketsRef,
                    where('clientId', '==', guestId), // We use clientId field for guestId too
                    where('status', '==', 'open'),
                    limit(1)
                );

                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const ticketDoc = snapshot.docs[0];
                    setTicketId(ticketDoc.id);
                } else {
                    // Show welcome message locally if no ticket exists yet
                    setMessages([{
                        id: 'welcome',
                        senderId: 'system',
                        senderName: 'Support',
                        senderRole: 'admin',
                        message: '👋 Hi, how can I help you?',
                        timestamp: { toDate: () => new Date() },
                        read: false
                    }]);
                }
            } catch (error) {
                console.error('Error loading guest ticket:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTicket();
    }, [guestId]);

    // Listen to messages
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
        });

        return () => unsubscribe();
    }, [ticketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        setNewMessage('');

        try {
            let currentTicketId = ticketId;

            if (!currentTicketId) {
                // Create new ticket for Guest
                const ticketsRef = collection(db, 'supportTickets');
                const newTicket = {
                    clientId: guestId,
                    clientName: 'Usuario Invitado',
                    clientEmail: 'No Email Provided',
                    status: 'open',
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    unreadByClient: 0,
                    unreadByAdmin: 1,
                    source: 'Landing Page - Guest',
                    userRole: 'guest'
                };

                const docRef = await addDoc(ticketsRef, newTicket);
                currentTicketId = docRef.id;
                setTicketId(currentTicketId);

                // Add welcome message to DB
                await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
                    senderId: 'system',
                    senderName: 'Support',
                    senderRole: 'admin',
                    message: '👋 Hi, how can I help you?',
                    timestamp: serverTimestamp(),
                    read: true
                });
            }

            // Send guest message
            await addDoc(collection(db, 'supportTickets', currentTicketId, 'messages'), {
                senderId: guestId,
                senderName: 'Guest',
                senderRole: 'client', // Treating guest as client role for filter convenience
                message: messageText,
                timestamp: serverTimestamp(),
                read: false
            });

            await updateDoc(doc(db, 'supportTickets', currentTicketId), {
                lastMessageAt: serverTimestamp(),
                unreadByAdmin: 1
            });

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background-dark md:bg-black/80 md:items-center md:justify-center">
            <div className="flex-1 w-full h-full md:w-full md:max-w-md md:h-[600px] flex flex-col bg-background-dark md:bg-surface-dark md:rounded-2xl md:shadow-2xl md:border md:border-white/10 relative overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-purple-600 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">support_agent</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Soporte Invitado</h2>
                            <p className="text-xs text-white/80">¡Estamos aquí para ayudarte!</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-white text-xl">close</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === guestId;
                        const isSystem = msg.senderId === 'system' || msg.senderRole === 'admin';

                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${isMe
                                    ? 'bg-primary text-black rounded-br-sm'
                                    : 'bg-surface-dark text-white border border-white/10 rounded-bl-sm'
                                    }`}>
                                    {!isMe && (
                                        <p className="text-[10px] text-primary font-bold mb-1 opacity-80">
                                            {msg.senderName}
                                        </p>
                                    )}
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 bg-surface-dark border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-background-dark text-white px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="bg-primary text-black w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
