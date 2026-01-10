import React, { useState, useMemo } from 'react';
import { Order, TeamMember, Screen } from '../../types';
import { parseSafeDate } from '../../utils/dateUtils';

interface WasherEarningsScreenProps {
    orders: Order[];
    team: TeamMember[];
    navigate: (screen: Screen, washerId?: string) => void;
}

export const WasherEarningsScreen: React.FC<WasherEarningsScreenProps> = ({
    orders,
    team,
    navigate
}) => {
    const washers = team.filter(t => t.role === 'washer');

    // Calculate stats for each washer
    const washerStats = useMemo(() => {
        return washers.map(washer => {
            const washerOrders = orders.filter(o => o.washerId === washer.id && o.status === 'Completed');

            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            const weekOrders = washerOrders.filter(o => {
                const orderDate = parseSafeDate(o.createdAt || o.date);
                return orderDate >= weekStart;
            });

            const monthOrders = washerOrders.filter(o => {
                const orderDate = parseSafeDate(o.createdAt || o.date);
                return orderDate >= monthStart;
            });

            const calculateEarnings = (ordersList: Order[]) => {
                return ordersList.reduce((sum, order) => {
                    return sum + (order.financialBreakdown?.washerGrossEarnings || 0);
                }, 0);
            };

            return {
                washer,
                totalOrders: washerOrders.length,
                totalEarnings: calculateEarnings(washerOrders),
                weekEarnings: calculateEarnings(weekOrders),
                monthEarnings: calculateEarnings(monthOrders),
                weekOrders: weekOrders.length,
                monthOrders: monthOrders.length
            };
        });
    }, [washers, orders]);

    return (
        <div className="flex flex-col h-full bg-background-dark text-white p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Washer Earnings</h1>
                <p className="text-slate-400">Dashboard de todos los washers con sus estadísticas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {washerStats.map(({ washer, totalOrders, totalEarnings, weekEarnings, monthEarnings, weekOrders, monthOrders }) => (
                    <div
                        key={washer.id}
                        onClick={() => navigate(Screen.ADMIN_WASHER_HISTORY, washer.id)}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-dark to-surface-dark/50 border border-white/10 p-6 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative">
                            {/* Avatar and Name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-blue-500/30 border-2 border-primary/50">
                                    {washer.avatar ? (
                                        <img src={washer.avatar} alt={washer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl text-white">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{washer.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full">
                                            <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                            <span className="text-xs font-bold text-amber-400">
                                                {typeof washer.rating === 'number' ? washer.rating.toFixed(1) : '5.0'}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${washer.status === 'Active'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {washer.status === 'Active' ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-xs text-slate-400 mb-1">Total Órdenes</p>
                                    <p className="text-2xl font-bold">{totalOrders}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5">
                                    <p className="text-xs text-slate-400 mb-1">Total Ganado</p>
                                    <p className="text-2xl font-bold text-green-400">${totalEarnings.toFixed(0)}</p>
                                </div>
                            </div>

                            {/* Period Stats */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <div>
                                        <p className="text-sm font-medium">This Week</p>
                                        <p className="text-xs text-slate-500">{weekOrders} órdenes</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">${weekEarnings.toFixed(0)}</p>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <div>
                                        <p className="text-sm font-medium">Este Mes</p>
                                        <p className="text-xs text-slate-500">{monthOrders} órdenes</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-400">${monthEarnings.toFixed(0)}</p>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between text-sm text-primary group-hover:text-primary/80">
                                    <span className="font-medium">Ver Historial Completo</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {washers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">group</span>
                    <p className="text-lg">No hay washers registrados</p>
                </div>
            )}
        </div>
    );
};
