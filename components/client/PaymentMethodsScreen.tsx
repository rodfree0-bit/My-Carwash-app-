import React, { useState } from 'react';
import { Screen } from '../../types';

interface PaymentMethodsScreenProps {
    savedCards: any[];
    selectedCardId: string;
    onSelectCard: (id: string) => void;
    onAddCard: () => void;
    navigate: (screen: Screen) => void;
}

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({
    savedCards = [],
    selectedCardId,
    onSelectCard,
    onAddCard,
    navigate
}) => {
    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="flex items-center px-4 py-4 border-b border-white/5">
                <button onClick={() => navigate(Screen.CLIENT_ADDRESS)}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-6">Payment Methods</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <p className="text-slate-400 text-sm mb-6">Select or add a payment method</p>

                <div className="space-y-3">
                    {savedCards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => {
                                onSelectCard(card.id);
                            }}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedCardId === card.id
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                                : 'bg-surface-dark border-white/10 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold uppercase tracking-wider">
                                    {card.brand}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold">•••• {card.last4}</p>
                                    <p className="text-xs text-slate-400">Expires {card.expiry}</p>
                                </div>
                            </div>
                            {selectedCardId === card.id && (
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                            )}
                        </button>
                    ))}

                    <button
                        onClick={onAddCard}
                        className="w-full p-4 rounded-xl border border-dashed border-white/20 bg-surface-dark/50 text-slate-400 flex items-center justify-center gap-2 hover:bg-white/5 transition-all mt-4"
                    >
                        <span className="material-symbols-outlined">add_card</span>
                        <span className="font-medium">Add New Card</span>
                    </button>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-background-dark via-background-dark to-transparent z-10">
                <button
                    onClick={() => {
                        if (selectedCardId) navigate(Screen.CLIENT_CONFIRM);
                    }}
                    disabled={!selectedCardId}
                    style={selectedCardId ? { backgroundColor: '#3b82f6' } : {}}
                    className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${selectedCardId
                        ? 'hover:brightness-90 text-white shadow-blue'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    Continue to Summary
                </button>
            </div>
        </div>
    );
};
