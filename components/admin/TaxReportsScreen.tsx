import React, { useState, useMemo } from 'react';
import { Order, TeamMember, TaxReport } from '../../types';

interface TaxReportsScreenProps {
    orders: Order[];
    team: TeamMember[];
}

export const TaxReportsScreen: React.FC<TaxReportsScreenProps> = ({ orders, team }) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [generatedReport, setGeneratedReport] = useState<TaxReport | null>(null);
    const [viewingMonth, setViewingMonth] = useState<{ index: number; name: string } | null>(null);

    // Get available years
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        orders.forEach(order => {
            const orderDate = order.createdAt?.toDate?.() || new Date(order.date);
            years.add(orderDate.getFullYear());
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [orders]);

    // Generate report
    const generateReport = () => {
        const yearOrders = orders.filter(o => {
            const orderDate = o.createdAt?.toDate?.() || new Date(o.date);
            return orderDate.getFullYear() === selectedYear && o.status === 'Completed';
        });

        // Summary
        const summary = {
            totalOrders: yearOrders.length,
            grossRevenue: yearOrders.reduce((sum, o) => sum + (o.financialBreakdown?.grandTotal || o.price || 0), 0),
            totalAppFees: yearOrders.reduce((sum, o) => sum + (o.financialBreakdown?.appRevenue || 0), 0),
            totalWasherPayments: yearOrders.reduce((sum, o) => sum + (o.financialBreakdown?.washerGrossEarnings || 0), 0),
            totalTips: yearOrders.reduce((sum, o) => sum + (o.tip || 0), 0),
            totalDiscounts: yearOrders.reduce((sum, o) => sum + (o.financialBreakdown?.discountAmount || 0), 0),
            totalRefunds: yearOrders.filter(o => o.refundAmount).reduce((sum, o) => sum + (o.refundAmount || 0), 0)
        };

        // Monthly breakdown
        const monthlyBreakdown = [];
        for (let month = 0; month < 12; month++) {
            const monthOrders = yearOrders.filter(o => {
                const orderDate = o.createdAt?.toDate?.() || new Date(o.date);
                return orderDate.getMonth() === month;
            });

            monthlyBreakdown.push({
                monthIndex: month,
                month: new Date(selectedYear, month, 1).toLocaleDateString('es', { month: 'long', year: 'numeric' }),
                orders: monthOrders.length,
                revenue: monthOrders.reduce((sum, o) => sum + (o.financialBreakdown?.grandTotal || o.price || 0), 0),
                appFees: monthOrders.reduce((sum, o) => sum + (o.financialBreakdown?.appRevenue || 0), 0),
                washerPayments: monthOrders.reduce((sum, o) => sum + (o.financialBreakdown?.washerGrossEarnings || 0), 0)
            });
        }

        // Service breakdown
        const serviceMap: Record<string, { count: number; revenue: number }> = {};
        yearOrders.forEach(order => {
            const service = order.service || 'Sin especificar';
            if (!serviceMap[service]) {
                serviceMap[service] = { count: 0, revenue: 0 };
            }
            serviceMap[service].count++;
            serviceMap[service].revenue += (order.financialBreakdown?.grandTotal || order.price || 0);
        });

        const serviceBreakdown = Object.entries(serviceMap).map(([serviceName, data]) => ({
            serviceName,
            orderCount: data.count,
            revenue: data.revenue
        }));

        // Washer 1099 data
        const washerMap: Record<string, { name: string; paid: number; count: number }> = {};
        yearOrders.forEach(order => {
            if (order.washerId && order.washerName) {
                if (!washerMap[order.washerId]) {
                    washerMap[order.washerId] = { name: order.washerName, paid: 0, count: 0 };
                }
                washerMap[order.washerId].paid += (order.financialBreakdown?.washerGrossEarnings || 0);
                washerMap[order.washerId].count++;
            }
        });

        const washer1099Data = Object.entries(washerMap).map(([washerId, data]) => ({
            washerId,
            washerName: data.name,
            totalPaid: data.paid,
            orderCount: data.count
        }));

        // Fee breakdown
        const feeMap: Record<string, number> = {};
        yearOrders.forEach(order => {
            if (order.financialBreakdown?.fees) {
                order.financialBreakdown.fees.forEach(fee => {
                    feeMap[fee.name] = (feeMap[fee.name] || 0) + fee.amount;
                });
            }
        });

        const feeBreakdown = Object.entries(feeMap).map(([feeName, totalAmount]) => ({
            feeName,
            totalAmount
        }));

        const report: TaxReport = {
            id: `tax-report-${selectedYear}`,
            year: selectedYear,
            generatedAt: Date.now(),
            generatedBy: 'admin',
            summary,
            monthlyBreakdown,
            serviceBreakdown,
            washer1099Data,
            feeBreakdown
        };

        setGeneratedReport(report);
    };

    const exportToPDF = () => {
        if (!generatedReport) return;

        // Create printable HTML
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Reporte Fiscal ${selectedYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #333; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; font-weight: bold; }
            .summary { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <h1>REPORTE FISCAL - AÑO ${selectedYear}</h1>
          
          <div class="summary">
            <h2>RESUMEN EJECUTIVO</h2>
            <p><strong>Órdenes Totales:</strong> ${generatedReport.summary.totalOrders}</p>
            <p><strong>Ingresos Brutos:</strong> $${generatedReport.summary.grossRevenue.toFixed(2)}</p>
            <p><strong>Total Fees de App:</strong> $${generatedReport.summary.totalAppFees.toFixed(2)}</p>
            <p><strong>Total Pagado a Washers:</strong> $${generatedReport.summary.totalWasherPayments.toFixed(2)}</p>
            <p><strong>Total Propinas:</strong> $${generatedReport.summary.totalTips.toFixed(2)}</p>
            <p><strong>Total Descuentos:</strong> $${generatedReport.summary.totalDiscounts.toFixed(2)}</p>
            <p><strong>Total Reembolsos:</strong> $${generatedReport.summary.totalRefunds.toFixed(2)}</p>
          </div>

          <h2>DESGLOSE MENSUAL</h2>
          <table>
            <tr>
              <th>Mes</th>
              <th>Órdenes</th>
              <th>Ingresos</th>
              <th>Fees App</th>
              <th>Pagos Washers</th>
            </tr>
            ${generatedReport.monthlyBreakdown.map(m => `
              <tr>
                <td>${m.month}</td>
                <td>${m.orders}</td>
                <td>$${m.revenue.toFixed(2)}</td>
                <td>$${m.appFees.toFixed(2)}</td>
                <td>$${m.washerPayments.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>

          <h2>INFORMACIÓN PARA 1099 (Washers)</h2>
          <table>
            <tr>
              <th>Washer</th>
              <th>Órdenes</th>
              <th>Total Pagado</th>
            </tr>
            ${generatedReport.washer1099Data.map(w => `
              <tr>
                <td>${w.washerName}</td>
                <td>${w.orderCount}</td>
                <td>$${w.totalPaid.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>

          <p style="margin-top: 40px; text-align: center; color: #999;">
            Generado el ${new Date().toLocaleDateString()}
          </p>
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.print();
    };

    const exportToCSV = () => {
        if (!generatedReport) return;

        const headers = ['Mes', 'Órdenes', 'Ingresos', 'Fees App', 'Pagos Washers'];
        const rows = generatedReport.monthlyBreakdown.map(m => [
            m.month,
            m.orders,
            m.revenue.toFixed(2),
            m.appFees.toFixed(2),
            m.washerPayments.toFixed(2)
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax-report-${selectedYear}.csv`;
        a.click();
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white p-6 overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Reportes Fiscales</h1>
                <p className="text-slate-400">Genera reportes anuales para declaración de impuestos</p>
            </div>

            {/* Year Selector */}
            <div className="mb-8 p-6 rounded-2xl bg-surface-dark border border-white/10">
                <div className="flex items-center gap-4">
                    <label className="text-lg font-medium">Año Fiscal:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-6 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:outline-none focus:border-primary text-lg"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={generateReport}
                        className="px-8 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/80 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">description</span>
                        Generar Reporte
                    </button>
                </div>
            </div>

            {/* Generated Report */}
            {generatedReport && (
                <div className="space-y-6">
                    {/* Export Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={exportToPDF}
                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            Exportar PDF
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">table_chart</span>
                            Exportar CSV
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <h2 className="text-2xl font-bold mb-6">RESUMEN EJECUTIVO - {selectedYear}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Órdenes Totales</p>
                                <p className="text-3xl font-bold">{generatedReport.summary.totalOrders}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Ingresos Brutos</p>
                                <p className="text-3xl font-bold text-green-400">${generatedReport.summary.grossRevenue.toFixed(0)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Fees de App</p>
                                <p className="text-3xl font-bold text-primary">${generatedReport.summary.totalAppFees.toFixed(0)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Pagado a Washers</p>
                                <p className="text-3xl font-bold text-purple-400">${generatedReport.summary.totalWasherPayments.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Breakdown */}
                    <div className="p-6 rounded-2xl bg-surface-dark border border-white/10">
                        <h2 className="text-xl font-bold mb-4">Desglose Mensual</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-400">Mes</th>
                                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-400">Órdenes</th>
                                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-400">Ingresos</th>
                                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-400">Fees App</th>
                                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-400">Pagos Washers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedReport.monthlyBreakdown.filter(m => m.orders > 0).map((month, index) => (
                                        <tr key={index} className="border-b border-white/5">
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setViewingMonth({ index: month.monthIndex, name: month.month })}
                                                    className="text-primary hover:underline font-bold text-left"
                                                >
                                                    {month.month}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right">{month.orders}</td>
                                            <td className="px-4 py-3 text-right font-bold">${month.revenue.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right text-primary">${month.appFees.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right text-purple-400">${month.washerPayments.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Washer 1099 Data */}
                    <div className="p-6 rounded-2xl bg-surface-dark border border-white/10">
                        <h2 className="text-xl font-bold mb-4">Información para 1099 (Washers)</h2>
                        <div className="space-y-3">
                            {generatedReport.washer1099Data.map((washer, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                    <div>
                                        <p className="font-bold">{washer.washerName}</p>
                                        <p className="text-sm text-slate-400">{washer.orderCount} órdenes completadas</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">${washer.totalPaid.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!generatedReport && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">description</span>
                    <p className="text-lg">Selecciona un año y genera el reporte</p>
                </div>
            )}

            {/* Monthly Order Detail Modal */}
            {viewingMonth && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold capitalize">{viewingMonth.name}</h2>
                                <p className="text-slate-400 text-sm">Desglose de órdenes del mes</p>
                            </div>
                            <button onClick={() => setViewingMonth(null)} className="p-2 hover:bg-white/5 rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 text-left">
                                        <th className="pb-3 text-sm font-bold text-slate-400">Fecha</th>
                                        <th className="pb-3 text-sm font-bold text-slate-400">Cliente</th>
                                        <th className="pb-3 text-sm font-bold text-slate-400">Washer</th>
                                        <th className="pb-3 text-right text-sm font-bold text-slate-400">Total</th>
                                        <th className="pb-3 text-right text-sm font-bold text-slate-400">Fee App</th>
                                        <th className="pb-3 text-right text-sm font-bold text-slate-400">Pay</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders.filter(o => {
                                        const d = o.createdAt?.toDate?.() || new Date(o.date);
                                        return d.getFullYear() === selectedYear && d.getMonth() === viewingMonth.index && o.status === 'Completed';
                                    }).sort((a, b) => {
                                        const da = a.createdAt?.toDate?.() || new Date(a.date);
                                        const db = b.createdAt?.toDate?.() || new Date(b.date);
                                        return db.getTime() - da.getTime();
                                    }).map(order => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-3">
                                                {new Date(order.createdAt?.toDate?.() || order.date).toLocaleDateString()}
                                                <div className="text-xs text-slate-500">{new Date(order.createdAt?.toDate?.() || order.date).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="py-3">{order.clientName}</td>
                                            <td className="py-3">{order.washerName}</td>
                                            <td className="py-3 text-right font-bold">${(order.financialBreakdown?.grandTotal || order.price || 0).toFixed(2)}</td>
                                            <td className="py-3 text-right text-primary">${(order.financialBreakdown?.appRevenue || 0).toFixed(2)}</td>
                                            <td className="py-3 text-right text-purple-400">${(order.financialBreakdown?.washerGrossEarnings || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {orders.filter(o => {
                                        const d = o.createdAt?.toDate?.() || new Date(o.date);
                                        return d.getFullYear() === selectedYear && d.getMonth() === viewingMonth.index && o.status === 'Completed';
                                    }).length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-slate-500">
                                                    No se encontraron órdenes completadas en este mes.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/5 text-right">
                            <button
                                onClick={() => setViewingMonth(null)}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
