import React, { useState } from 'react';
import { IssueReport } from '../types';

interface SupportTicketsProps {
    issues: IssueReport[];
    updateIssue: (id: string, updates: Partial<IssueReport>) => Promise<void>;
    clients: any[];
    navigate: (screen: any) => void;
}

export const SupportTickets: React.FC<SupportTicketsProps> = ({
    issues,
    updateIssue,
    clients,
    navigate
}) => {
    const [filter, setFilter] = useState<'All' | 'Open' | 'Resolved'>('All');
    const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
    const [responseText, setResponseText] = useState('');

    const filteredIssues = issues.filter(issue => {
        if (filter === 'All') return true;
        return issue.status === filter;
    });

    const handleResolve = async (issueId: string) => {
        try {
            await updateIssue(issueId, { status: 'Resolved' });
            setSelectedIssue(null);
        } catch (error) {
            console.error('Error resolving issue:', error);
        }
    };

    const handleReopen = async (issueId: string) => {
        try {
            await updateIssue(issueId, { status: 'Open' });
        } catch (error) {
            console.error('Error reopening issue:', error);
        }
    };

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || 'Unknown Client';
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/20';
            case 'low': return 'text-green-400 bg-green-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <header className="px-4 py-4 border-b border-white/10">
                <h1 className="text-2xl font-bold">Support Tickets</h1>
                <p className="text-sm text-slate-400 mt-1">Manage customer issues and support requests</p>
            </header>

            {/* Filters */}
            <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto">
                {(['All', 'Open', 'Resolved'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${filter === f
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        {f} ({issues.filter(i => f === 'All' || i.status === f).length})
                    </button>
                ))}
            </div>

            {/* Issues List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
                            support_agent
                        </span>
                        <h3 className="text-xl font-bold mb-2">No Issues Found</h3>
                        <p className="text-slate-400 text-sm">
                            {filter === 'All'
                                ? 'No support tickets have been submitted yet'
                                : `No ${filter.toLowerCase()} issues at the moment`
                            }
                        </p>
                    </div>
                ) : (
                    filteredIssues.map(issue => (
                        <div
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className="bg-surface-dark rounded-xl p-4 border border-white/5 hover:border-primary/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{issue.subject}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${issue.status === 'Open'
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        From: {getClientName(issue.clientId)} • {issue.clientEmail}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">
                                    chevron_right
                                </span>
                            </div>

                            <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                                {issue.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>
                                    {new Date(issue.timestamp).toLocaleDateString()} at{' '}
                                    {new Date(issue.timestamp).toLocaleTimeString()}
                                </span>
                                {issue.orderId && (
                                    <span className="text-primary">Order #{issue.orderId}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Issue Detail Modal */}
            {selectedIssue && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-dark w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{selectedIssue.subject}</h2>
                                <p className="text-sm text-slate-400">
                                    Ticket #{selectedIssue.id?.substring(0, 8)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Client Info */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
                                    Client Information
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="text-slate-400">Name:</span>{' '}
                                        <span className="font-bold">{getClientName(selectedIssue.clientId)}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-slate-400">Email:</span>{' '}
                                        <span className="font-bold">{selectedIssue.clientEmail}</span>
                                    </p>
                                    {selectedIssue.orderId && (
                                        <p className="text-sm">
                                            <span className="text-slate-400">Related Order:</span>{' '}
                                            <span className="font-bold text-primary">#{selectedIssue.orderId}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Issue Description */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
                                    Issue Description
                                </h3>
                                <p className="text-sm leading-relaxed">{selectedIssue.description}</p>
                            </div>

                            {/* Image if exists */}
                            {selectedIssue.image && (
                                <div className="bg-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">
                                        Attached Image
                                    </h3>
                                    <img
                                        src={selectedIssue.image}
                                        alt="Issue"
                                        className="w-full rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Timestamp */}
                            <div className="text-xs text-slate-500 text-center">
                                Submitted on {new Date(selectedIssue.timestamp).toLocaleString()}
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-4 border-t border-white/10 space-y-3">
                            {selectedIssue.status === 'Open' ? (
                                <>
                                    <button
                                        onClick={() => handleResolve(selectedIssue.id!)}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Mark as Resolved
                                    </button>
                                    <button
                                        onClick={() => setSelectedIssue(null)}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleReopen(selectedIssue.id!)}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">refresh</span>
                                        Reopen Ticket
                                    </button>
                                    <button
                                        onClick={() => setSelectedIssue(null)}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
