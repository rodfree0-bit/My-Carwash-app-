
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Screen } from '../../types';

interface FleetQuote {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    vehicleType: string;
    vehicleCount: number;
    additionalNotes?: string;
    status: 'new' | 'contacting' | 'contacted' | 'closed';
    createdAt: any;
}

export const FleetQuotesScreen: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
    const [quotes, setQuotes] = useState<FleetQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'fleetQuotes'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const quoteData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as FleetQuote[];
            setQuotes(quoteData);
            setLoading(loading => false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (quoteId: string, status: FleetQuote['status']) => {
        try {
            await updateDoc(doc(db, 'fleetQuotes', quoteId), { status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteQuote = async (quoteId: string) => {
        if (window.confirm('Are you sure you want to delete this quote request?')) {
            try {
                await deleteDoc(doc(db, 'fleetQuotes', quoteId));
            } catch (error) {
                console.error('Error deleting quote:', error);
            }
        }
    };

    const getStatusColor = (status: FleetQuote['status']) => {
        switch (status) {
            case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'contacting': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'contacted': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(Screen.ADMIN_DASHBOARD)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Fleet Quotes</h1>
                        <p className="text-xs text-slate-400">Commercial & semi-truck inquiries</p>
                    </div>
                </div>
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                    {quotes.filter(q => q.status === 'new').length} New
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="text-center p-12 bg-surface-dark rounded-2xl border border-dashed border-white/10">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">assignment_late</span>
                        <p className="text-slate-400">No quote requests found</p>
                    </div>
                ) : (
                    quotes.map(quote => (
                        <div key={quote.id} className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{quote.fullName}</h3>
                                    <p className="text-xs text-slate-400">
                                        {quote.createdAt?.toDate ? quote.createdAt.toDate().toLocaleString() : 'Just now'}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(quote.status)}`}>
                                    {quote.status}
                                </span>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 text-sm">phone</span>
                                        <a href={`tel:${quote.phone}`} className="text-primary hover:underline">{quote.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 text-sm">location_on</span>
                                        <span className="text-slate-300">{quote.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-slate-500 text-sm">local_shipping</span>
                                        <span className="text-slate-300 font-bold capitalize">{quote.vehicleType}</span>
                                        <span className="bg-white/5 px-2 py-0.5 rounded text-xs">Qty: {quote.vehicleCount}</span>
                                    </div>
                                </div>

                                {quote.additionalNotes && (
                                    <div className="bg-black/20 p-3 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1 font-bold uppercase">Notes</p>
                                        <p className="text-sm text-slate-300 italic">"{quote.additionalNotes}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/5 flex flex-wrap gap-2 justify-end">
                                <select
                                    className="bg-background-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                                    value={quote.status}
                                    onChange={(e) => updateStatus(quote.id, e.target.value as any)}
                                >
                                    <option value="new">New</option>
                                    <option value="contacting">Contacting</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button
                                    onClick={() => deleteQuote(quote.id)}
                                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
