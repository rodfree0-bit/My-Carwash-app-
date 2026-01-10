import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    active: boolean;
    validFrom?: string;
    validUntil?: string;
    usageLimit?: number;
    usageCount: number;
    minimumOrderAmount?: number;
    description?: string;
    applicableServices?: string[];
}

export const CouponSystem: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: '',
        type: 'percentage',
        value: 0,
        active: true,
        usageCount: 0
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            const q = query(collection(db, 'coupons'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
            setCoupons(data);
        } catch (error) {
            console.error('Error loading coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveCoupon = async () => {
        try {
            if (!formData.code || !formData.value) {
                alert('Please fill in required fields');
                return;
            }

            const couponData = {
                ...formData,
                code: formData.code!.toUpperCase(),
                createdAt: Timestamp.now()
            };

            if (formData.id) {
                await updateDoc(doc(db, 'coupons', formData.id), couponData);
            } else {
                await addDoc(collection(db, 'coupons'), couponData);
            }

            setShowForm(false);
            setFormData({ code: '', type: 'percentage', value: 0, active: true, usageCount: 0 });
            loadCoupons();
        } catch (error) {
            console.error('Error saving coupon:', error);
            alert('Error saving coupon');
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;

        try {
            await deleteDoc(doc(db, 'coupons', id));
            loadCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8"><div className="spinner" /></div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Coupon Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New Coupon'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {formData.id ? 'Edit Coupon' : 'Create New Coupon'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                placeholder="SUMMER2024"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Value * {formData.type === 'percentage' ? '(%)' : '($)'}
                            </label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                min="0"
                                max={formData.type === 'percentage' ? 100 : undefined}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usageLimit || ''}
                                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || undefined })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                placeholder="Unlimited"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Valid From</label>
                            <input
                                type="date"
                                value={formData.validFrom || ''}
                                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Valid Until</label>
                            <input
                                type="date"
                                value={formData.validUntil || ''}
                                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Minimum Order Amount ($)</label>
                            <input
                                type="number"
                                value={formData.minimumOrderAmount || ''}
                                onChange={(e) => setFormData({ ...formData, minimumOrderAmount: parseFloat(e.target.value) || undefined })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <span className="text-sm font-medium">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            rows={3}
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={saveCoupon}
                            className="bg-primary text-black px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Save Coupon
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setFormData({ code: '', type: 'percentage', value: 0, active: true, usageCount: 0 });
                            }}
                            className="bg-white/5 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold font-mono">{coupon.code}</h3>
                                    {coupon.active ? (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                <p className="text-2xl font-bold text-primary mb-2">
                                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                                </p>

                                {coupon.description && (
                                    <p className="text-slate-400 text-sm mb-3">{coupon.description}</p>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Usage:</span>{' '}
                                        <span className="text-white font-semibold">
                                            {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                                        </span>
                                    </div>

                                    {coupon.minimumOrderAmount && (
                                        <div>
                                            <span className="text-slate-500">Min Order:</span>{' '}
                                            <span className="text-white font-semibold">${coupon.minimumOrderAmount}</span>
                                        </div>
                                    )}

                                    {coupon.validFrom && (
                                        <div>
                                            <span className="text-slate-500">Valid From:</span>{' '}
                                            <span className="text-white font-semibold">{coupon.validFrom}</span>
                                        </div>
                                    )}

                                    {coupon.validUntil && (
                                        <div>
                                            <span className="text-slate-500">Valid Until:</span>{' '}
                                            <span className="text-white font-semibold">{coupon.validUntil}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setFormData(coupon);
                                        setShowForm(true);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {coupons.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <p>No coupons created yet. Click "New Coupon" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
