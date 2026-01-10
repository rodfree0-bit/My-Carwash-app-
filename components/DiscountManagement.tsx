import React, { useState } from 'react';
import { Screen, Discount } from '../types';

interface DiscountManagementProps {
    discounts: Discount[];
    navigate: (screen: Screen) => void;
    currentUser: any;
    createDiscount: (data: Omit<Discount, 'id' | 'usageCount'>) => Promise<string>;
    updateDiscount: (id: string, updates: Partial<Discount>) => Promise<void>;
    deleteDiscount: (id: string) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const DiscountManagement: React.FC<DiscountManagementProps> = ({
    discounts,
    navigate,
    currentUser,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    showToast
}) => {
    const [showModal, setShowModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        description: '',
        active: true,
        validFrom: '',
        validUntil: '',
        usageLimit: undefined as number | undefined,
        applicableTo: 'all' as 'all' | 'packages' | 'addons' | 'total',
        minimumOrderAmount: undefined as number | undefined
    });

    const handleOpenModal = (discount?: Discount) => {
        if (discount) {
            setEditingDiscount(discount);
            setFormData({
                code: discount.code,
                type: discount.type,
                value: discount.value,
                description: discount.description,
                active: discount.active,
                validFrom: discount.validFrom || '',
                validUntil: discount.validUntil || '',
                usageLimit: discount.usageLimit,
                applicableTo: discount.applicableTo,
                minimumOrderAmount: discount.minimumOrderAmount
            });
        } else {
            setEditingDiscount(null);
            setFormData({
                code: '',
                type: 'percentage',
                value: 0,
                description: '',
                active: true,
                validFrom: '',
                validUntil: '',
                usageLimit: undefined,
                applicableTo: 'all',
                minimumOrderAmount: undefined
            });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.code || !formData.description || formData.value <= 0) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        try {
            const discountData = {
                code: formData.code.toUpperCase(),
                type: formData.type,
                value: formData.value,
                description: formData.description,
                active: formData.active,
                validFrom: formData.validFrom || undefined,
                validUntil: formData.validUntil || undefined,
                usageLimit: formData.usageLimit,
                applicableTo: formData.applicableTo,
                minimumOrderAmount: formData.minimumOrderAmount,
                createdBy: currentUser.id,
                createdDate: new Date().toISOString()
            };

            if (editingDiscount) {
                await updateDiscount(editingDiscount.id, discountData);
                showToast('Discount updated successfully', 'success');
            } else {
                await createDiscount(discountData);
                showToast('Discount created successfully', 'success');
            }

            setShowModal(false);
        } catch (error) {
            showToast('Error saving discount', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this discount?')) {
            try {
                await deleteDiscount(id);
                showToast('Discount deleted', 'info');
            } catch (error) {
                showToast('Error deleting discount', 'error');
            }
        }
    };

    const handleToggleActive = async (discount: Discount) => {
        try {
            await updateDiscount(discount.id, { active: !discount.active });
            showToast(`Discount ${!discount.active ? 'activated' : 'deactivated'}`, 'success');
        } catch (error) {
            showToast('Error updating discount', 'error');
        }
    };

    const activeDiscounts = discounts.filter(d => d.active);
    const inactiveDiscounts = discounts.filter(d => !d.active);

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(Screen.ADMIN_DASHBOARD)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Discount Codes</h1>
                        <p className="text-sm text-slate-400">Manage promotional codes</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Discount
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Active Discounts */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        Active Discounts ({activeDiscounts.length})
                    </h2>
                    <div className="space-y-3">
                        {activeDiscounts.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">discount</span>
                                <p>No active discounts</p>
                            </div>
                        ) : (
                            activeDiscounts.map(discount => (
                                <div key={discount.id} className="bg-surface-dark rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-primary">{discount.code}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                                    Active
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300">{discount.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(discount)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(discount)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">visibility_off</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(discount.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div className="bg-black/20 rounded-lg p-2">
                                            <p className="text-xs text-slate-400 mb-1">Discount</p>
                                            <p className="font-bold text-primary">
                                                {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-lg p-2">
                                            <p className="text-xs text-slate-400 mb-1">Used</p>
                                            <p className="font-bold">
                                                {discount.usageCount}{discount.usageLimit ? `/${discount.usageLimit}` : ''}
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-lg p-2">
                                            <p className="text-xs text-slate-400 mb-1">Valid Until</p>
                                            <p className="font-bold text-xs">
                                                {discount.validUntil ? new Date(discount.validUntil).toLocaleDateString() : 'No limit'}
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-lg p-2">
                                            <p className="text-xs text-slate-400 mb-1">Min. Order</p>
                                            <p className="font-bold text-xs">
                                                {discount.minimumOrderAmount ? `$${discount.minimumOrderAmount}` : 'None'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Inactive Discounts */}
                {inactiveDiscounts.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-500">cancel</span>
                            Inactive Discounts ({inactiveDiscounts.length})
                        </h2>
                        <div className="space-y-3">
                            {inactiveDiscounts.map(discount => (
                                <div key={discount.id} className="bg-surface-dark/50 rounded-xl p-4 border border-white/5 opacity-60">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg font-bold">{discount.code}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg-slate-500/20 text-slate-400">
                                                    Inactive
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400">{discount.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleActive(discount)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(discount.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
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
                    <div className="bg-surface-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-surface-dark">
                            <h2 className="text-xl font-bold">{editingDiscount ? 'Edit Discount' : 'New Discount'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Code */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Discount Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white uppercase"
                                    placeholder="SUMMER2024"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Description *</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    placeholder="Summer promotion discount"
                                />
                            </div>

                            {/* Type and Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    >
                                        <option value="percentage" className="bg-surface-dark text-white">Percentage</option>
                                        <option value="fixed" className="bg-surface-dark text-white">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Value *</label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                                        step={formData.type === 'percentage' ? '1' : '0.01'}
                                    />
                                </div>
                            </div>

                            {/* Valid From/Until */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Valid From (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Valid Until (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    />
                                </div>
                            </div>

                            {/* Usage Limit and Min Order */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Usage Limit (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit || ''}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Min. Order Amount (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.minimumOrderAmount || ''}
                                        onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        placeholder="No minimum"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Applicable To */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Applicable To</label>
                                <select
                                    value={formData.applicableTo}
                                    onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value as any })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
                                >
                                    <option value="all" className="bg-surface-dark text-white">All Services</option>
                                    <option value="packages" className="bg-surface-dark text-white">Packages Only</option>
                                    <option value="addons" className="bg-surface-dark text-white">Add-ons Only</option>
                                    <option value="total" className="bg-surface-dark text-white">Order Total</option>
                                </select>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label className="text-sm font-bold">Active (visible to clients)</label>
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
                                {editingDiscount ? 'Update' : 'Create'} Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Nav active={Screen.ADMIN_DISCOUNTS} navigate={navigate} />
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
