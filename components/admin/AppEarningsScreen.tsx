import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import { parseSafeDate } from '../../utils/dateUtils';

interface AppEarningsScreenProps {
    orders: Order[];
}

export const AppEarningsScreen: React.FC<AppEarningsScreenProps> = ({ orders }) => {
    const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');

    // Calculate earnings
    const earnings = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const yearStart = new Date(now.getFullYear(), 0, 1);

        const completedOrders = orders.filter(o => o.status === 'Completed');

        const filterByDate = (ordersList: Order[], startDate: Date) => {
            return ordersList.filter(o => {
                const orderDate = parseSafeDate(o.createdAt || o.date);
                return orderDate >= startDate;
            });
        };

        const calculateRevenue = (ordersList: Order[]) => {
            return ordersList.reduce((sum, order) => {
                return sum + (order.financialBreakdown?.appRevenue || 0);
            }, 0);
        };

        const todayOrders = filterByDate(completedOrders, today);
        const weekOrders = filterByDate(completedOrders, weekStart);
        const monthOrders = filterByDate(completedOrders, monthStart);
        const yearOrders = filterByDate(completedOrders, yearStart);

        return {
            today: calculateRevenue(todayOrders),
            week: calculateRevenue(weekOrders),
            month: calculateRevenue(monthOrders),
            year: calculateRevenue(yearOrders),
            allTime: calculateRevenue(completedOrders),
            todayOrders: todayOrders.length,
            weekOrders: weekOrders.length,
            monthOrders: monthOrders.length,
            yearOrders: yearOrders.length,
            allTimeOrders: completedOrders.length
        };
    }, [orders]);

    // Monthly chart data (last 12 months)
    const monthlyData = useMemo(() => {
        const months = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthOrders = orders.filter(o => {
                if (o.status !== 'Completed') return false;
                const orderDate = parseSafeDate(o.createdAt || o.date);
                return orderDate >= monthStart && orderDate <= monthEnd;
            });

            const revenue = monthOrders.reduce((sum, order) => {
                return sum + (order.financialBreakdown?.appRevenue || 0);
            }, 0);

            months.push({
                month: date.toLocaleDateString('es', { month: 'short', year: '2-digit' }),
                revenue,
                orders: monthOrders.length
            });
        }

        return months;
    }, [orders]);

    const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

    // Fee breakdown
    const feeBreakdown = useMemo(() => {
        const fees: Record<string, number> = {};

        orders.filter(o => o.status === 'Completed').forEach(order => {
            if (order.financialBreakdown?.fees) {
                order.financialBreakdown.fees.forEach(fee => {
                    fees[fee.name] = (fees[fee.name] || 0) + fee.amount;
                });
            }
        });

        return Object.entries(fees).map(([name, amount]) => ({ name, amount }));
    }, [orders]);

    return (
        <div className="flex flex-col h-full bg-background-dark text-white p-6 overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">App Earnings</h1>
                <p className="text-slate-400">Dashboard de ingresos por fees</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                    <p className="text-sm text-slate-400 mb-2">Hoy</p>
                    <p className="text-3xl font-bold text-blue-400">${earnings.today.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 mt-1">{earnings.todayOrders} órdenes</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                    <p className="text-sm text-slate-400 mb-2">This Week</p>
                    <p className="text-3xl font-bold text-purple-400">${earnings.week.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 mt-1">{earnings.weekOrders} órdenes</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                    <p className="text-sm text-slate-400 mb-2">Este Mes</p>
                    <p className="text-3xl font-bold text-primary">${earnings.month.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 mt-1">{earnings.monthOrders} órdenes</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
                    <p className="text-sm text-slate-400 mb-2">Este Año</p>
                    <p className="text-3xl font-bold text-green-400">${earnings.year.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 mt-1">{earnings.yearOrders} órdenes</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
                    <p className="text-sm text-slate-400 mb-2">Total</p>
                    <p className="text-3xl font-bold text-amber-400">${earnings.allTime.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 mt-1">{earnings.allTimeOrders} órdenes</p>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="mb-8 p-6 rounded-2xl bg-surface-dark border border-white/10">
                <h2 className="text-xl font-bold mb-6">Ingresos Mensuales (Últimos 12 Meses)</h2>
                <div className="flex items-end gap-2 h-64">
                    {monthlyData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col justify-end h-full">
                                <div
                                    className="w-full bg-gradient-to-t from-primary to-blue-500 rounded-t-lg transition-all hover:opacity-80 relative group"
                                    style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: data.revenue > 0 ? '4px' : '0' }}
                                >
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        <p className="text-sm font-bold">${data.revenue.toFixed(0)}</p>
                                        <p className="text-xs text-slate-400">{data.orders} órdenes</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 transform -rotate-45 origin-top-left mt-2">{data.month}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fee Breakdown */}
            {feeBreakdown.length > 0 && (
                <div className="p-6 rounded-2xl bg-surface-dark border border-white/10">
                    <h2 className="text-xl font-bold mb-6">Desglose por Tipo de Fee</h2>
                    <div className="space-y-4">
                        {feeBreakdown.map((fee, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <span className="font-medium">{fee.name}</span>
                                <span className="text-2xl font-bold text-primary">${fee.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
