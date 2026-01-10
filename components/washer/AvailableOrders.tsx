import React from 'react';
import { Order, Screen } from '../../types';

interface AvailableOrdersProps {
    orders: Order[];
    navigate: (screen: Screen, orderId?: string) => void;
    onGrabOrder: (orderId: string) => void;
}

export const AvailableOrders: React.FC<AvailableOrdersProps> = ({ orders, navigate, onGrabOrder }) => {
    // Filter only "New" orders (not assigned to anyone)
    const availableOrders = orders.filter(o => o.status === 'Pending');

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-surface-dark">
                <button
                    onClick={() => navigate(Screen.WASHER_DASHBOARD)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <div className="flex-1 text-center">
                    <h1 className="font-bold text-xl">Available Orders</h1>
                    <p className="text-xs text-slate-400 mt-1">{availableOrders.length} orders waiting</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3b82f6]">notifications_active</span>
                </div>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {availableOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-6xl text-slate-600">inbox</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">No orders available</h3>
                        <p className="text-slate-400 text-sm">New orders will appear here</p>
                    </div>
                ) : (
                    availableOrders.map(order => (
                        <div
                            key={order.id}
                            className="bg-surface-dark rounded-xl p-4 border border-white/10 hover:border-[#3b82f6]/50 transition-all cursor-pointer"
                            onClick={() => {
                                // Navigate to order details or grab directly
                                navigate(Screen.WASHER_JOB_DETAILS, order.id);
                            }}
                        >
                            {/* Order Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-[#3b82f6] text-sm">person</span>
                                        <p className="font-bold">{typeof order.clientName === 'string' ? order.clientName : 'Client'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                        <span>
                                            {typeof order.date === 'string' ? order.date : 'Date TBD'} - {typeof order.time === 'string' ? order.time : 'Time TBD'}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-bold rounded-full border border-[#3b82f6]/30">
                                    NEW
                                </div>
                            </div>

                            {/* Service Info */}
                            <div className="flex items-center gap-2 mb-3 text-sm">
                                <span className="material-symbols-outlined text-blue-400 text-sm">local_car_wash</span>
                                <span className="text-slate-300">{typeof order.service === 'string' ? order.service : 'Service'}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-300">{typeof order.vehicle === 'string' ? order.vehicle : 'Vehicle'}</span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2 mb-4 p-3 bg-black/20 rounded-lg">
                                <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5">location_on</span>
                                <p className="text-sm text-slate-300 flex-1">{typeof order.address === 'string' ? order.address : 'Address not available'}</p>
                            </div>

                            {/* Price and Action */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400">Total Payout</p>
                                    <p className="text-2xl font-bold text-[#3b82f6]">${order.price}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onGrabOrder(order.id);
                                    }}
                                    className="px-6 py-3 bg-[#3b82f6] text-white font-bold rounded-xl hover:brightness-90 transition-colors flex items-center gap-2 shadow-blue"
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Grab
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
