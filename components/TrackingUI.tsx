
import React from 'react';
import { Order, User, Message } from '../types';
import { TrackingMap } from './TrackingMap';
import { OrderChat } from './OrderChat';
import { LoadingSpinner } from './LoadingSpinner';

interface TrackingUIProps {
    activeTrackingOrder: Order | null;
    user: User;
    setTrackingOrderId: (id: string | null) => void;
    setShowOrderChat: (show: boolean) => void;
    showOrderChat: boolean;
    messages: Message[];
    sendMessage: (senderId: string, receiverId: string, orderId: string, content: string, type?: 'text' | 'image') => Promise<void>;
    updateOrder: (orderId: string, data: Partial<Order>) => Promise<void>;
    showNativeToast: (msg: string, type?: 'success' | 'error') => void;
    submitOrderRating: (orderId: string, rating: any) => Promise<void>;
    navigate: (screen: string) => void;
    packages: any[];
    addons: any[];
}

export const TrackingUI: React.FC<TrackingUIProps> = ({
    activeTrackingOrder,
    user,
    setTrackingOrderId,
    setShowOrderChat,
    showOrderChat,
    messages,
    sendMessage,
    updateOrder,
    showNativeToast,
    submitOrderRating,
    navigate,
    packages,
    addons
}) => {
    // Local state for rating (lifted from Client.tsx usage)
    const [currentRating, setCurrentRating] = React.useState(0);
    const [currentTip, setCurrentTip] = React.useState(0);
    const [clientReviewText, setClientReviewText] = React.useState('');

    if (!activeTrackingOrder) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-slate-950 to-black flex flex-col">
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-4 z-50 transition-all ${activeTrackingOrder.status === 'En Route' ? 'bg-transparent absolute top-0 left-0 right-0' : 'bg-black/40 backdrop-blur-md border-b border-white/10'}`}>
                <button onClick={() => setTrackingOrderId(null)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="font-black uppercase tracking-[0.2em] text-sm">{activeTrackingOrder.status === 'En Route' ? '' : 'Order Tracking'}</h1>
                <div className="w-10 h-10 rounded-full border-2 border-[#3b82f6]/30 overflow-hidden bg-white/5 shadow-blue">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3b82f6] to-blue-600 text-[10px] font-black text-white">
                            {user.name?.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Status Views */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* 1. PENDING (Searching) */}
                {activeTrackingOrder.status === 'Pending' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-gradient-to-b from-black via-[#3b82f6]/10 to-black relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b82f620_0%,_transparent_70%)] pointer-events-none"></div>
                        {/* Animations... */}
                        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#3b82f6]/30 to-blue-400/30 flex items-center justify-center border-2 border-primary/50 shadow-blue-lg">
                                <span className="material-symbols-outlined text-4xl text-white">search</span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black mb-4 text-white drop-shadow-blue tracking-tight">Finding a Washer</h2>
                        <p className="text-slate-300 font-medium">We are contacting nearby washers...</p>
                    </div>
                )}

                {/* 2. ASSIGNED */}
                {(activeTrackingOrder.status === 'Assigned') && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-gradient-to-b from-black via-slate-900 to-black w-full">
                        <h2 className="text-4xl font-black mb-4 text-primary shadow-blue animate-pulse tracking-tight">He's getting ready!</h2>
                        <p className="text-slate-300 mb-10 text-lg">
                            <span className="text-primary font-black">{activeTrackingOrder.washerName || 'Washer'}</span> is preparing.
                        </p>
                        <button onClick={() => setShowOrderChat(true)} className="w-full max-w-[300px] py-4 bg-[#1a1a1c] border border-white/10 rounded-2xl font-black text-white flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined">chat</span> Message Washer
                        </button>
                    </div>
                )}

                {/* 3. EN ROUTE */}
                {activeTrackingOrder.status === 'En Route' && (
                    <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
                        <TrackingMap
                            washerLocation={activeTrackingOrder.washerLocation}
                            clientLocation={activeTrackingOrder.location}
                            status={activeTrackingOrder.status}
                            serviceRadius={20}
                            washerName={activeTrackingOrder.washerName || 'Your Washer'}
                            eta={Number(activeTrackingOrder.estimatedArrival) || 10}
                        />
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pb-12">
                            <div className="bg-black/80 backdrop-blur-xl border border-[#3b82f6]/20 p-5 rounded-[2.5rem] shadow-2xl flex items-center gap-5">
                                <div className="flex-1">
                                    <h3 className="text-[#3b82f6] font-black text-[10px] uppercase tracking-[0.25em]">Heading to you</h3>
                                    <p className="text-white text-lg font-black">
                                        {activeTrackingOrder.washerName} is on his way
                                        {activeTrackingOrder.estimatedArrival && (
                                            <span className="text-primary ml-2 animate-pulse">
                                                ({activeTrackingOrder.estimatedArrival})
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="pointer-events-auto">
                                <button onClick={() => setShowOrderChat(true)} className="w-full py-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl font-black text-white flex items-center justify-center gap-3 shadow-2xl uppercase tracking-[0.25em] text-xs">
                                    <span className="material-symbols-outlined text-xl text-[#3b82f6]">chat_bubble</span> Message Washer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. ARRIVED */}
                {activeTrackingOrder.status === 'Arrived' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-gradient-to-b from-black via-[#3b82f6]/10 to-black w-full">
                        <h2 className="text-4xl font-black mb-4 text-primary shadow-blue animate-pulse tracking-tight">Ready to Start!</h2>
                        <p className="text-slate-300 mb-10 text-lg">Your washer has arrived. Please approve to begin.</p>
                        <div className="w-full max-w-sm space-y-4">
                            <button onClick={async () => {
                                if (window.confirm('Confirm washer arrival?')) {
                                    await updateOrder(activeTrackingOrder.id, { clientAuthorized: true });
                                    showNativeToast('Service authorized!');
                                }
                            }} className="w-full bg-primary py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                                <span className="material-symbols-outlined">play_circle</span> Authorize Start
                            </button>
                            <button onClick={() => setShowOrderChat(true)} className="w-full bg-white/5 border border-white/10 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary">chat</span> Chat
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. IN PROGRESS */}
                {(activeTrackingOrder.status === 'In Progress') && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-black w-full">
                        <h2 className="text-4xl font-black mb-4 text-white tracking-tight">Washing your Car!</h2>
                        <div className="flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full border border-primary/20 shadow-blue mb-8">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <p className="text-primary font-bold tracking-widest text-sm uppercase">In Progress</p>
                        </div>
                    </div>
                )}

                {/* 6. COMPLETED */}
                {activeTrackingOrder.status === 'Completed' && (
                    <div className="flex-1 flex flex-col p-6 animate-fade-in bg-black overflow-y-auto">
                        <div className="text-center mb-8">
                            <span className="material-symbols-outlined text-6xl text-primary font-bold animate-bounce mb-4">check_circle</span>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Wash Completed!</h2>
                        </div>
                        <div className="bg-surface-dark border border-white/10 rounded-3xl p-6 shadow-2xl mb-6">
                            <p className="text-center text-xs font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Rate your experience</p>
                            <div className="flex justify-center gap-3 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setCurrentRating(star)} className={`transition-all active:scale-90 ${currentRating >= star ? 'scale-110' : 'opacity-30 grayscale'}`}>
                                        <span className={`material-symbols-outlined text-5xl ${currentRating >= star ? 'text-primary filled' : 'text-slate-400'}`}>star</span>
                                    </button>
                                ))}
                            </div>
                            {currentRating > 0 && (
                                <div className="space-y-4">
                                    {/* Tips */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {[0, 10, 15, 20].map((pct) => {
                                            const basePrice = activeTrackingOrder.financialBreakdown?.clientTotal || activeTrackingOrder.price || 0;
                                            const tipVal = Math.round(basePrice * pct / 100);
                                            // Handle highlighting based on percentage to avoid conflicts with 0 values
                                            const isSelected = pct === 0 ? currentTip === 0 : (currentTip > 0 && Math.abs(currentTip - tipVal) < 1);

                                            return (
                                                <button
                                                    key={pct}
                                                    onClick={() => setCurrentTip(tipVal)}
                                                    className={`py-3 rounded-xl border transition-all ${isSelected ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white'}`}
                                                >
                                                    <div className="text-xs font-black">{pct}%</div>
                                                    <div className="text-[10px] opacity-70">${tipVal}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <textarea
                                        placeholder="Review..."
                                        value={clientReviewText}
                                        onChange={e => setClientReviewText(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 outline-none transition-colors h-24 resize-none"
                                    />
                                </div>
                            )}
                        </div>
                        <button disabled={currentRating === 0} onClick={async () => {
                            try {
                                await submitOrderRating(activeTrackingOrder.id, { clientRating: currentRating, clientReview: clientReviewText, tip: currentTip, washerId: activeTrackingOrder.washerId || '' });
                                setTrackingOrderId(null);
                                navigate('CLIENT_HOME'); // Note: You'll need to pass Screen enum or string properly
                                showNativeToast('Thanks!');
                            } catch (e) { showNativeToast('Error'); }
                        }} className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm">Finish</button>
                    </div>
                )}
            </div>

            {activeTrackingOrder.washerId && (
                <OrderChat
                    orderId={activeTrackingOrder.id}
                    currentUserId={user.id}
                    currentUserName={user.name}
                    otherUserId={activeTrackingOrder.washerId}
                    otherUserName={activeTrackingOrder.washerName || 'Washer'}
                    messages={messages}
                    sendMessage={sendMessage}
                    isOpen={showOrderChat}
                    onClose={() => setShowOrderChat(false)}
                />
            )}
        </div>
    );
};
