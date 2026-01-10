import React, { useState } from 'react';
import { Screen, Bonus } from '../types';

interface BonusManagementProps {
    bonuses: Bonus[];
    team: any[];
    navigate: (screen: Screen) => void;
    currentUser: any;
    createBonus: (data: Omit<Bonus, 'id' | 'status'>) => Promise<string>;
    updateBonus: (id: string, updates: Partial<Bonus>) => Promise<void>;
    deleteBonus: (id: string) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const BonusManagement: React.FC<BonusManagementProps> = ({
    bonuses,
    team,
    navigate,
    currentUser,
    createBonus,
    updateBonus,
    deleteBonus,
    showToast
}) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        washerId: '',
        washerName: '',
        amount: 0,
        reason: ''
    });

    const washers = team.filter(m => m.role === 'washer' && m.status === 'Active');
    const pendingBonuses = bonuses.filter(b => b.status === 'pending');
    const appliedBonuses = bonuses.filter(b => b.status === 'applied');

    const handleOpenModal = () => {
        setFormData({
            washerId: '',
            washerName: '',
            amount: 0,
            reason: ''
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.washerId || !formData.amount || !formData.reason) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            await createBonus({
                washerId: formData.washerId,
                washerName: formData.washerName,
                amount: formData.amount,
                reason: formData.reason,
                date: new Date().toISOString(),
                createdBy: currentUser.id,
                createdByName: currentUser.name
            });
            showToast('Bonus created successfully', 'success');
            setShowModal(false);
        } catch (error) {
            showToast('Error creating bonus', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this bonus?')) {
            try {
                await deleteBonus(id);
                showToast('Bonus deleted', 'info');
            } catch (error) {
                showToast('Error deleting bonus', 'error');
            }
        }
    };

    const handleWasherChange = (washerId: string) => {
        const washer = washers.find(w => w.id === washerId);
        setFormData({
            ...formData,
            washerId,
            washerName: washer?.name || ''
        });
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="p-4 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Bonus Management</h1>
                    <p className="text-sm text-slate-400">Reward your washers</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Bonus
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Pending Bonuses */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400">schedule</span>
                        Pending Bonuses ({pendingBonuses.length})
                    </h2>
                    <div className="space-y-3">
                        {pendingBonuses.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">card_giftcard</span>
                                <p>No pending bonuses</p>
                            </div>
                        ) : (
                            pendingBonuses.map(bonus => (
                                <div key={bonus.id} className="bg-surface-dark rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl font-bold">{bonus.washerName}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-2">{bonus.reason}</p>
                                            <p className="text-xs text-slate-500">
                                                Created by {bonus.createdByName} on {new Date(bonus.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-2xl font-bold text-green-400">+${bonus.amount.toFixed(2)}</span>
                                            <button
                                                onClick={() => handleDelete(bonus.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-xs text-yellow-400">
                                        <span className="material-symbols-outlined text-sm mr-1">info</span>
                                        Will be applied on next payment
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Applied Bonuses */}
                {appliedBonuses.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                            Applied Bonuses ({appliedBonuses.length})
                        </h2>
                        <div className="space-y-3">
                            {appliedBonuses.map(bonus => (
                                <div key={bonus.id} className="bg-surface-dark/50 rounded-xl p-4 border border-white/5 opacity-70">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold">{bonus.washerName}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                                    Applied
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400">{bonus.reason}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(bonus.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="text-lg font-bold text-green-400">+${bonus.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-bold">New Bonus</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Washer Selection */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Washer *</label>
                                <select
                                    value={formData.washerId}
                                    onChange={(e) => handleWasherChange(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                >
                                    <option value="">Select a washer</option>
                                    {washers.map(washer => (
                                        <option key={washer.id} value={washer.id}>
                                            {washer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Amount *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input
                                        type="number"
                                        value={formData.amount || ''}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white"
                                        placeholder="50.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Reason *</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                                    placeholder="Excellent customer service, went above and beyond..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-white/5 hover:bg-white/10 transition-colors rounded-lg py-3 font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-primary hover:bg-primary-dark transition-colors rounded-lg py-3 font-bold"
                            >
                                Create Bonus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Nav active={Screen.ADMIN_PAYROLL} navigate={navigate} />
        </div>
    );
};

// Nav Component (copied from Admin.tsx)
const Nav: React.FC<{ active: Screen; navigate: (screen: Screen) => void }> = ({ active, navigate }) => (
    <div className="sticky bottom-0 bg-background-dark border-t border-white/10 p-2 flex justify-around z-20 overflow-x-auto">
        <div className="flex justify-around w-full max-w-lg mx-auto min-w-[350px]">
            {[
                { s: Screen.ADMIN_DASHBOARD, i: 'grid_view', l: 'Orders' },
                { s: Screen.ADMIN_TEAM, i: 'group', l: 'Team' },
                { s: Screen.ADMIN_CLIENTS, i: 'person', l: 'Clients' },
                { s: Screen.ADMIN_PRICING, i: 'sell', l: 'Services' },
                { s: Screen.ADMIN_ANALYTICS, i: 'monitoring', l: 'Metrics' },
            ].map(item => (
                <button key={item.s} onClick={() => navigate(item.s)} className={`flex flex-col items-center p-2 min-w-[50px] ${active === item.s ? 'text-primary' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-xl">{item.i}</span>
                    <span className="text-[10px] mt-1 font-medium">{item.l}</span>
                </button>
            ))}
        </div>
    </div>
);
