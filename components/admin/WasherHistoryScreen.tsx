import React, { useState, useMemo } from 'react';
import { Order, TeamMember, Screen } from '../../types';
import { parseSafeDate } from '../../utils/dateUtils';

interface WasherHistoryScreenProps {
    washerId: string;
    orders: Order[];
    team: TeamMember[];
    globalFees: { name: string, percentage: number }[];
    navigate: (screen: Screen) => void;
}

export const WasherHistoryScreen: React.FC<WasherHistoryScreenProps> = ({
    washerId,
    orders,
    team,
    globalFees,
    navigate
}) => {
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'all'>('all');

    const washer = team.find(t => t.id === washerId);

    // Filter washer's orders
    const washerOrders = useMemo(() => {
        let filtered = orders.filter(o => o.washerId === washerId && o.status === 'Completed');

        const now = new Date();
        if (dateFilter !== 'all') {
            filtered = filtered.filter(order => {
                const orderDate = parseSafeDate(order.createdAt || order.date);
                const diffTime = now.getTime() - orderDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                switch (dateFilter) {
                    case 'week':
                        return diffDays < 7;
                    case 'month':
                        return diffDays < 30;
                    case 'year':
                        return diffDays < 365;
                    default:
                        return true;
                }
            });
        }

        return filtered.sort((a, b) => {
            const dateA = parseSafeDate(a.createdAt || a.date);
            const dateB = parseSafeDate(b.createdAt || b.date);
            return dateB.getTime() - dateA.getTime();
        });
    }, [orders, washerId, dateFilter]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalFeePercent = globalFees.reduce((sum, fee) => sum + fee.percentage, 0);

        return washerOrders.reduce((acc, order) => {
            const breakdown = order.financialBreakdown;
            const price = breakdown?.grandTotal || order.price || 0;
            const tip = breakdown?.washerTipEarnings || order.tip || 0;

            // Calculate Net Earnings fallback
            const deduction = (price * totalFeePercent) / 100;
            const netEarnings = breakdown?.washerGrossEarnings || (price - deduction); // Base Net

            // Commission (in this context "Comisiones" label in UI seems to mean "Base Earnings" or "Net", but let's map it:
            // UI has "Total Ganado" (Total Won) -> Usually Net + Tips
            // "Comisiones" -> Usually Base Net
            // "Propinas" -> Tips

            // In the previous logic: totalEarnings = washerGrossEarnings (which is usually Net + Tips in backend)
            // totalCommissions = washerBaseEarnings (Net without tips)

            const finalBase = breakdown?.washerBaseEarnings || (price - deduction);
            const finalTotal = breakdown?.washerGrossEarnings || (finalBase + tip);

            return {
                totalOrders: acc.totalOrders + 1,
                totalEarnings: acc.totalEarnings + finalTotal,
                totalCommissions: acc.totalCommissions + finalBase,
                totalTips: acc.totalTips + tip
            };
        }, {
            totalOrders: 0,
            totalEarnings: 0,
            totalCommissions: 0,
            totalTips: 0
        });
    }, [washerOrders, globalFees]);

    if (!washer) {
        return (
            <div className="flex items-center justify-center h-full bg-background-dark text-white">
                <p>Washer no encontrado</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <button
                    onClick={() => navigate(Screen.ADMIN_WASHER_EARNINGS)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver a Washers
                </button>

                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-blue-500/30 border-2 border-primary/50">
                        {washer.avatar ? (
                            <img src={washer.avatar} alt={washer.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">person</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{washer.name}</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                                <span className="text-sm font-bold text-amber-400">
                                    {typeof washer.rating === 'number' ? washer.rating.toFixed(1) : '5.0'}
                                </span>
                            </div>
                            <span className="text-sm text-slate-400">{washer.completedJobs || 0} trabajos completados</span>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-4">
                    <label className="text-sm text-slate-400">Período:</label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as any)}
                        className="px-4 py-2 rounded-xl bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary"
                    >
                        <option value="week">This Week</option>
                        <option value="month">Este Mes</option>
                        <option value="year">Este Año</option>
                        <option value="all">Todo el Historial</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                        <p className="text-sm text-slate-400 mb-1">Órdenes</p>
                        <p className="text-2xl font-bold">{totals.totalOrders}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
                        <p className="text-sm text-slate-400 mb-1">Total Ganado</p>
                        <p className="text-2xl font-bold text-green-400">${totals.totalEarnings.toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                        <p className="text-sm text-slate-400 mb-1">Comisiones</p>
                        <p className="text-2xl font-bold text-purple-400">${totals.totalCommissions.toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
                        <p className="text-sm text-slate-400 mb-1">Propinas</p>
                        <p className="text-2xl font-bold text-amber-400">${totals.totalTips.toFixed(0)}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-surface-dark border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Cliente</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Servicio</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Total Orden</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Comisión</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Propina</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {washerOrders.map((order) => {
                            const breakdown = order.financialBreakdown;
                            const price = breakdown?.grandTotal || order.price || 0;
                            const tip = breakdown?.washerTipEarnings || order.tip || 0;

                            const totalFeePercent = globalFees.reduce((sum, fee) => sum + fee.percentage, 0);
                            const deduction = (price * totalFeePercent) / 100;

                            const baseNet = breakdown?.washerBaseEarnings || (price - deduction);
                            const totalNet = breakdown?.washerGrossEarnings || (baseNet + tip);

                            const displayId = order.id.startsWith('#') ? order.id : `#${order.id}`;

                            return (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 text-sm font-mono text-slate-400">{displayId.substring(0, 9)}...</td>
                                    <td className="px-4 py-4 text-sm">{parseSafeDate(order.createdAt || order.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 text-sm">{order.clientName}</td>
                                    <td className="px-4 py-4 text-sm text-slate-400">{order.service || 'Standard Wash'}</td>
                                    <td className="px-4 py-4 text-sm text-right">${price.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right text-purple-400">${baseNet.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right text-amber-400">${tip.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right font-bold text-green-400">${totalNet.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {washerOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-50">receipt_long</span>
                        <p className="text-lg">No hay órdenes en este período</p>
                    </div>
                )}
            </div>
        </div>
    );
};
