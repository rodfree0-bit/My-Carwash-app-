import React, { useState, useMemo } from 'react';
import { Order, TeamMember, Screen } from '../../types';

interface FinancialReportsScreenProps {
    orders: Order[];
    team: TeamMember[];
    navigate: (screen: Screen) => void;
}

export const FinancialReportsScreen: React.FC<FinancialReportsScreenProps> = ({
    orders,
    team,
    navigate
}) => {
    const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('week');
    const [washerFilter, setWasherFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter orders
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Date filter
        const now = new Date();
        if (dateFilter !== 'all') {
            filtered = filtered.filter(order => {
                const orderDate = order.createdAt?.toDate?.() || new Date(order.date);
                const diffTime = now.getTime() - orderDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                switch (dateFilter) {
                    case 'today':
                        return diffDays < 1;
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

        // Washer filter
        if (washerFilter !== 'all') {
            filtered = filtered.filter(o => o.washerId === washerFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.date);
            const dateB = b.createdAt?.toDate?.() || new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        });
    }, [orders, dateFilter, washerFilter, statusFilter]);

    // Calculate totals
    const totals = useMemo(() => {
        return filteredOrders.reduce((acc, order) => {
            const breakdown = order.financialBreakdown;
            return {
                totalOrders: acc.totalOrders + 1,
                totalRevenue: acc.totalRevenue + (breakdown?.grandTotal || order.price || 0),
                totalWasherEarnings: acc.totalWasherEarnings + (breakdown?.washerGrossEarnings || 0),
                totalAppRevenue: acc.totalAppRevenue + (breakdown?.appRevenue || 0),
                totalTips: acc.totalTips + (order.tip || 0)
            };
        }, {
            totalOrders: 0,
            totalRevenue: 0,
            totalWasherEarnings: 0,
            totalAppRevenue: 0,
            totalTips: 0
        });
    }, [filteredOrders]);

    const exportToCSV = () => {
        const headers = ['ID', 'Date', 'Client', 'Washer', 'Status', 'Total', 'Washer Earnings', 'App Earnings', 'Tip'];
        const rows = filteredOrders.map(order => [
            order.id,
            new Date(order.createdAt?.toDate?.() || order.date).toLocaleDateString(),
            order.clientName,
            order.washerName || 'Unassigned',
            order.status,
            `$${(order.financialBreakdown?.grandTotal || order.price || 0).toFixed(2)}`,
            `$${(order.financialBreakdown?.washerGrossEarnings || 0).toFixed(2)}`,
            `$${(order.financialBreakdown?.appRevenue || 0).toFixed(2)}`,
            `$${(order.tip || 0).toFixed(2)}`
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
                        <p className="text-slate-400">All orders with complete breakdown</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/80 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Period</label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    {/* Washer Filter */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Washer</label>
                        <select
                            value={washerFilter}
                            onChange={(e) => setWasherFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">All</option>
                            {team.filter(t => t.role === 'washer').map(washer => (
                                <option key={washer.id} value={washer.id}>{washer.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">All</option>
                            <option value="New">New</option>
                            <option value="Assigned">Assigned</option>
                            <option value="En Route">En Route</option>
                            <option value="Arrived">Arrived</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                        <p className="text-sm text-slate-400 mb-1">Orders</p>
                        <p className="text-2xl font-bold">{totals.totalOrders}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
                        <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold">${totals.totalRevenue.toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
                        <p className="text-sm text-slate-400 mb-1">Washer Earnings</p>
                        <p className="text-2xl font-bold">${totals.totalWasherEarnings.toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <p className="text-sm text-slate-400 mb-1">App Earnings</p>
                        <p className="text-2xl font-bold">${totals.totalAppRevenue.toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
                        <p className="text-sm text-slate-400 mb-1">Tips</p>
                        <p className="text-2xl font-bold">${totals.totalTips.toFixed(0)}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-surface-dark border-b border-white/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Date/Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Client</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Washer</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Total</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Washer Earnings</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">App Earnings</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Tip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => {
                            const breakdown = order.financialBreakdown;
                            const statusColors = {
                                'Pending': 'bg-blue-500/20 text-blue-400',
                                'Assigned': 'bg-purple-500/20 text-purple-400',
                                'En Route': 'bg-yellow-500/20 text-yellow-400',
                                'Arrived': 'bg-orange-500/20 text-orange-400',
                                'In Progress': 'bg-blue-500/20 text-blue-400',
                                'Completed': 'bg-green-500/20 text-green-400',
                                'Cancelled': 'bg-red-500/20 text-red-400'
                            };

                            return (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 text-sm font-mono text-slate-400">#{order.id.slice(0, 8)}</td>
                                    <td className="px-4 py-4 text-sm">
                                        <div>{new Date(order.createdAt?.toDate?.() || order.date).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-500">{new Date(order.createdAt?.toDate?.() || order.date).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm">{order.clientName}</td>
                                    <td className="px-4 py-4 text-sm">{order.washerName || <span className="text-slate-500">Unassigned</span>}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status as keyof typeof statusColors]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-right font-bold">${(breakdown?.grandTotal || order.price || 0).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right text-purple-400 font-bold">${(breakdown?.washerGrossEarnings || 0).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right text-primary font-bold">${(breakdown?.appRevenue || 0).toFixed(2)}</td>
                                    <td className="px-4 py-4 text-sm text-right text-amber-400">${(order.tip || 0).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-50">receipt_long</span>
                        <p className="text-lg">No orders to display</p>
                        <p className="text-sm">Adjust filters to see more results</p>
                    </div>
                )}
            </div>
        </div>
    );
};
