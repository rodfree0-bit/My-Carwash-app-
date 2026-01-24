import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, where, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Message {
    id?: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
}

interface SupportTicket {
    id?: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole?: string; // 'client', 'washer', 'admin'
    source?: string; // 'web-client', 'mobile-app', 'washer-panel'
    subject: string;
    status: 'open' | 'closed';
    createdAt: number;
    lastMessageAt: number;
}

export const SupportChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const loadOrCreateTicket = async () => {
            try {
                // Check if user has an open ticket
                const ticketsRef = collection(db, 'supportTickets');
                const q = query(
                    ticketsRef,
                    where('userId', '==', currentUser.uid),
                    where('status', '==', 'open'),
                    limit(1)
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    // Get user role from Firestore
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', currentUser.uid)));
                    let userRole = 'client'; // default

                    if (!userDoc.empty) {
                        userRole = userDoc.docs[0].data().role || 'client';
                    }

                    // Create new ticket
                    const newTicket: Omit<SupportTicket, 'id'> = {
                        userId: currentUser.uid,
                        userName: currentUser.displayName || 'User',
                        userEmail: currentUser.email || '',
                        userRole: userRole,
                        source: userRole === 'washer' ? 'App - Washer' : 'App - Client', // Detect platform
                        subject: 'Support Request',
                        status: 'open',
                        createdAt: Date.now(),
                        lastMessageAt: Date.now()
                    };

                    const docRef = await addDoc(ticketsRef, newTicket);
                    setTicketId(docRef.id);

                    // Send welcome message
                    await addDoc(collection(db, 'supportTickets', docRef.id, 'messages'), {
                        senderId: 'system',
                        senderName: 'Technical Support',
                        senderRole: 'system',
                        message: 'Hello! How can we help you today?',
                        timestamp: Date.now(),
                        read: false
                    });
                } else {
                    setTicketId(snapshot.docs[0].id);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading ticket:', error);
                setLoading(false);
            }
        };

        loadOrCreateTicket();
    }, [currentUser]);

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
            setMessages(msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
            scrollToBottom();
        }, (error) => {
            console.error('❌ Error listening to messages in SupportChat:', error);
        });

        return () => unsubscribe();
    }, [ticketId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !ticketId || !currentUser) return;

        try {
            // Get user doc to determine role
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDocs(query(collection(db, 'users'), where('__name__', '==', currentUser.uid)));
            const userRole = !userDocSnap.empty ? (userDocSnap.docs[0].data().role || 'client') : 'client';

            await addDoc(collection(db, 'supportTickets', ticketId, 'messages'), {
                senderId: currentUser.uid,
                senderName: currentUser.displayName || 'User',
                senderRole: userRole,
                message: newMessage.trim(),
                timestamp: Date.now(),
                read: false
            });

            // Update last message time and ensure status is open
            await updateDoc(doc(db, 'supportTickets', ticketId), {
                lastMessageAt: Date.now(),
                status: 'open'
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading support chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="bg-slate-800 p-4 rounded-t-lg flex justify-between items-center border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">💬 Technical Support</h2>
                        <p className="text-sm text-slate-400">We're here to help</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                        const isMyMessage = msg.senderId === currentUser?.uid;
                        const isSystem = msg.senderId === 'system';

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSystem
                                        ? 'bg-slate-700 text-slate-300'
                                        : isMyMessage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-white'
                                        }`}
                                >
                                    {!isMyMessage && (
                                        <p className="text-xs font-semibold mb-1 text-slate-400">
                                            {msg.senderName}
                                        </p>
                                    )}
                                    <p className="text-sm">{msg.message}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe your problem..."
                            className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
