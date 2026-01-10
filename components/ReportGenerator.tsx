import React, { useState } from 'react';
import { reportService, ReportData } from '../services/ReportService';

export const ReportGenerator: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<ReportData | null>(null);

    const generateReport = async (type: 'daily' | 'weekly' | 'monthly') => {
        setLoading(true);
        try {
            let reportData: ReportData;
            switch (type) {
                case 'daily':
                    reportData = await reportService.generateDailyReport();
                    break;
                case 'weekly':
                    reportData = await reportService.generateWeeklyReport();
                    break;
                case 'monthly':
                    reportData = await reportService.generateMonthlyReport();
                    break;
            }
            setReport(reportData);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Generate Reports</h2>

            <div className="flex gap-4">
                <button
                    onClick={() => generateReport('daily')}
                    disabled={loading}
                    className="bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                    Daily Report
                </button>
                <button
                    onClick={() => generateReport('weekly')}
                    disabled={loading}
                    className="bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                    Weekly Report
                </button>
                <button
                    onClick={() => generateReport('monthly')}
                    disabled={loading}
                    className="bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                    Monthly Report
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center p-12">
                    <div className="spinner-lg" />
                </div>
            )}

            {report && !loading && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{report.period} Report</h3>
                        <button
                            onClick={() => reportService.downloadCSV(report)}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">download</span>
                            Download CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-400">${report.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Total Orders</p>
                            <p className="text-2xl font-bold">{report.totalOrders}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Avg Order</p>
                            <p className="text-2xl font-bold">${report.avgOrderValue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Net Revenue</p>
                            <p className="text-2xl font-bold text-primary">${report.netRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
