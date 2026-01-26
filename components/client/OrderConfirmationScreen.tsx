import React, { useState } from 'react';
import { Screen, ServicePackage, ServiceAddon, SavedVehicle, VehicleType, Discount } from '../../types';

interface OrderConfirmationScreenProps {
    packages: ServicePackage[];
    addons: ServiceAddon[];
    vehicles: SavedVehicle[];
    vehicleConfigs: any[];
    selectedOption: 'asap' | 'scheduled';
    selectedDate: string;
    selectedTime: string;
    selectedAddress: string;
    navigate: (screen: Screen) => void;
    onConfirmOrder: (finalTotal: number, discount?: Discount | null) => void;
    globalFees: { name: string, percentage: number }[];
    discounts: Discount[];
    showFeesToClient?: boolean;
    selectedCard?: { id: string; brand: string; last4: string; expiry: string } | null;
    onAddCard?: () => void;
    userId?: string;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
    packages,
    addons,
    vehicles,
    vehicleConfigs,
    selectedOption,
    selectedDate,
    selectedTime,
    selectedAddress,
    navigate,
    onConfirmOrder,
    globalFees,
    discounts,
    showFeesToClient = false,
    selectedCard = null,
    onAddCard = () => { },
    userId
}) => {
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
    const [discountError, setDiscountError] = useState('');
    const [showTipCustom, setShowTipCustom] = useState(false);

    // Calculate subtotal (services only)
    const calculateSubtotal = () => {
        let subtotal = 0;
        (vehicleConfigs || []).forEach(config => {
            const pkg = (packages || []).find(p => p.id === config.packageId);
            const vehicle = (vehicles || []).find(v => v.id === config.vehicleId);
            if (pkg && vehicle) {
                const basePrice = pkg.price?.[vehicle.type as VehicleType] || 0;
                subtotal += basePrice;

                (config.addonIds || []).forEach((addonId: string) => {
                    const addon = (addons || []).find(a => a.id === addonId);
                    if (addon) {
                        subtotal += addon.price?.[vehicle.type as VehicleType] || 0;
                    }
                });
            }
        });
        return subtotal;
    };

    const handleApplyDiscount = () => {
        if (!discountCode.trim()) {
            setDiscountError('Please enter a discount code');
            return;
        }

        console.log('🔍 Checking discount:', discountCode, 'Available:', discounts);

        const discount = (discounts || []).find(d =>
            d.code.toLowerCase() === discountCode.toLowerCase() &&
            d.active
        );

        if (!discount) {
            setDiscountError('Invalid or expired discount code');
            setAppliedDiscount(null);
            return;
        }

        // Check exclusivity
        if (discount.clientId && discount.clientId !== userId) {
            setDiscountError('This code is exclusive to another user');
            setAppliedDiscount(null);
            return;
        }

        // Check usage limit
        if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
            setDiscountError('This code has reached its usage limit');
            setAppliedDiscount(null);
            return;
        }

        // Check date validity
        const now = new Date();
        if (discount.validFrom && new Date(discount.validFrom) > now) {
            setDiscountError('This code is not valid yet');
            setAppliedDiscount(null);
            return;
        }
        if (discount.validUntil) {
            const expiryDate = new Date(discount.validUntil);
            // Validation is inclusive of the end date (valid until 23:59:59 of that day)
            expiryDate.setHours(23, 59, 59, 999);

            if (expiryDate < now) {
                setDiscountError('This code has expired');
                setAppliedDiscount(null);
                return;
            }
        }

        console.log('✅ Discount applied:', discount);
        setDiscountError('');
        setAppliedDiscount(discount);
    };

    const subtotal = calculateSubtotal();
    const washNowFee = selectedOption === 'asap' ? 15 : 0;
    const subtotalWithWashNow = subtotal + washNowFee;

    // Calculate discount amount
    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discountAmount = (subtotalWithWashNow * appliedDiscount.value) / 100;
        } else {
            discountAmount = appliedDiscount.value;
        }
        // Check minimum order amount
        if (appliedDiscount.minimumOrderAmount && subtotalWithWashNow < appliedDiscount.minimumOrderAmount) {
            discountAmount = 0;
        }
    }

    const subtotalAfterDiscount = subtotalWithWashNow - discountAmount;

    // Calculate global fees (for display/washer calculations only, NOT charged to client)
    const totalFeesAmount = (globalFees || []).reduce((acc, fee) => {
        return acc + (subtotalAfterDiscount * fee.percentage / 100);
    }, 0);

    // Client pays ONLY the subtotal after discount (NO FEES)
    const finalTotal = subtotalAfterDiscount;

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <header className="flex items-center px-4 py-4 border-b border-white/5">
                <button onClick={() => navigate(Screen.CLIENT_ADDRESS)}>
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg mr-6">Confirm Order</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <p className="text-slate-400 text-sm mb-6">Review your order details</p>

                {/* Vehicles Section */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm text-slate-400 uppercase font-bold">Vehicles & Services</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(Screen.CLIENT_VEHICLE)}
                                className="text-primary text-sm font-bold flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add
                            </button>
                            <button
                                onClick={() => navigate(Screen.CLIENT_VEHICLE)}
                                className="text-primary text-sm font-bold flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Edit
                            </button>
                        </div>
                    </div>

                    {(vehicleConfigs || []).map((config, index) => {
                        const vehicle = (vehicles || []).find(v => v.id === config.vehicleId);
                        const vehicleType = vehicle?.type || 'sedan';
                        const pkg = (packages || []).find(p => p.id === config.packageId);

                        return (
                            <div key={config.vehicleId} className="bg-surface-dark rounded-xl border border-white/10 overflow-hidden">
                                {/* Vehicle Header with Photo */}
                                <div className="flex items-center gap-4 p-4 bg-white/5">
                                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                                        {vehicle?.image ? (
                                            <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-4xl text-primary">directions_car</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{vehicle?.model}</h3>
                                        <p className="text-sm text-slate-400">{vehicle?.color}</p>
                                        <p className="text-xs text-slate-500 mt-1">{vehicleType}</p>
                                    </div>
                                </div>

                                {/* Package and Addons */}
                                <div className="p-4 space-y-3">
                                    {/* Package */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1">Package</p>
                                            <p className="font-bold">{pkg?.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{pkg?.description}</p>
                                        </div>
                                        <p className="font-bold text-primary">${(pkg?.price && pkg.price[vehicleType as VehicleType]) || 0}</p>
                                    </div>

                                    {/* Addons */}
                                    {config.addonIds && config.addonIds.length > 0 && (
                                        <div className="border-t border-white/5 pt-3">
                                            <p className="text-xs text-slate-500 mb-2">Extras</p>
                                            {(config.addonIds || []).map((addonId: string) => {
                                                const addon = (addons || []).find(a => a.id === addonId);
                                                return (
                                                    <div key={addonId} className="flex justify-between text-sm text-slate-300 mb-1">
                                                        <span>+ {addon?.name}</span>
                                                        <span>${(addon?.price && addon.price[vehicleType as VehicleType]) || 0}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Date & Time */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-sm text-slate-400 uppercase font-bold">Schedule</h2>
                    <div className="p-4 rounded-xl bg-surface-dark border border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">schedule</span>
                            <div>
                                {selectedOption === 'asap' ? (
                                    <>
                                        <p className="font-bold">Wash Now Service</p>
                                        <p className="text-sm text-slate-400">Washer will arrive in 30-60 min</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold">{selectedDate}</p>
                                        <p className="text-sm text-slate-400">{selectedTime}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-sm text-slate-400 uppercase font-bold">Location</h2>
                    <div className="p-4 rounded-xl bg-surface-dark border border-white/10">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <p className="text-sm flex-1">{selectedAddress}</p>
                        </div>
                    </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-xs text-slate-400 uppercase font-bold">Discount Code</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 rounded-xl bg-surface-dark border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary"
                        />
                        <button
                            onClick={handleApplyDiscount}
                            style={{ backgroundColor: '#3b82f6' }}
                            className="px-4 py-2 rounded-xl text-white text-sm font-bold hover:brightness-110 transition-all shadow-blue whitespace-nowrap"
                        >
                            Apply
                        </button>
                    </div>
                    {discountError && (
                        <p className="text-red-400 text-sm">{discountError}</p>
                    )}
                    {appliedDiscount && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            <span>Discount "{appliedDiscount.code}" applied!</span>
                        </div>
                    )}
                </div>

                {/* Payment Method */}
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm text-slate-400 uppercase font-bold">Payment Method</h2>
                        {selectedCard && (
                            <button
                                onClick={onAddCard}
                                className="text-primary text-sm font-bold flex items-center gap-1"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div
                            onClick={onAddCard}
                            className="p-4 rounded-xl bg-surface-dark border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">credit_card</span>
                                <div className="flex-1">
                                    {selectedCard ? (
                                        <>
                                            <p className="font-bold">{selectedCard.brand} •••• {selectedCard.last4}</p>
                                            <p className="text-xs text-slate-400 mt-1">Expires {selectedCard.expiry}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm font-medium text-slate-400">Select Payment Method</p>
                                    )}
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400">arrow_forward_ios</span>
                        </div>
                    </div>
                </div>

                {/* Price Summary (Detailed breakdown remains scrollable) */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Billing Details</p>
                    {/* Per-Vehicle Breakdown */}
                    {(vehicleConfigs || []).map((config, index) => {
                        const vehicle = (vehicles || []).find(v => v.id === config.vehicleId);
                        const vehicleType = vehicle?.type || 'sedan';
                        const pkg = (packages || []).find(p => p.id === config.packageId);
                        const pkgPrice = pkg?.price?.[vehicleType as VehicleType] || 0;

                        return (
                            <div key={config.vehicleId} className="mb-3 text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-300">{vehicle?.model} - {pkg?.name}</span>
                                    <span className="font-bold">${pkgPrice.toFixed(2)}</span>
                                </div>
                                {config.addonIds && config.addonIds.length > 0 && (
                                    <div className="ml-2 space-y-1">
                                        {(config.addonIds || []).map((addonId: string) => {
                                            const addon = (addons || []).find(a => a.id === addonId);
                                            const addonPrice = addon?.price?.[vehicleType as VehicleType] || 0;
                                            return (
                                                <div key={addonId} className="flex justify-between text-xs text-slate-400">
                                                    <span>+ {addon?.name}</span>
                                                    <span>${addonPrice.toFixed(2)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="border-t border-white/10 pt-3 mt-3 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        {selectedOption === 'asap' && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Wash Now Fee</span>
                                <span className="font-bold text-white">$15.00</span>
                            </div>
                        )}
                        {appliedDiscount && discountAmount > 0 && (
                            <div className="flex justify-between items-center text-green-400">
                                <span>Discount ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `$${appliedDiscount.value}`})</span>
                                <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        {/* Fees are hidden for client as requested, or can be shown here if needed */}
                        {/* Final Total is now in the sticky footer */}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar with Total & Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-background-dark border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Total to Pay</p>
                        <p className="text-3xl font-black text-white">${finalTotal.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">{(vehicleConfigs || []).length} Vehicle{(vehicleConfigs || []).length !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-primary font-bold">{selectedOption === 'asap' ? 'Wash Now' : 'Scheduled'}</p>
                    </div>
                </div>
                <button
                    onClick={() => onConfirmOrder(finalTotal, appliedDiscount)}
                    style={{ backgroundColor: '#3b82f6' }}
                    className="w-full h-14 rounded-xl font-bold text-lg text-white shadow-blue active:scale-[0.98] transition-all"
                >
                    Confirm & Place Order
                </button>
            </div>
        </div>
    );
};
