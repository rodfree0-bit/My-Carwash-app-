import React, { useState, useEffect } from 'react';
import { Issue, issueService } from '../../services/issueService';

interface IssuesListProps {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ showToast }) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        setIsLoading(true);
        try {
            const allIssues = await issueService.getAllIssues();
            setIssues(allIssues);
        } catch (error) {
            showToast('Failed to load issues', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredIssues = issues.filter(issue => {
        if (filter === 'all') return true;
        return issue.status === filter;
    });

    const handleStatusChange = async (issueId: string, newStatus: Issue['status']) => {
        try {
            await issueService.updateIssueStatus(issueId, newStatus);
            showToast('Issue status updated', 'success');
            loadIssues();
            setSelectedIssue(null);
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    if (selectedIssue) {
        return (
            <div className="flex flex-col h-full bg-background-dark text-white">
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                    <button onClick={() => setSelectedIssue(null)}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="font-bold text-lg">Issue Details</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedIssue.status === 'open' ? 'bg-red-500/20 text-red-400' :
                                selectedIssue.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-green-500/20 text-green-400'
                            }`}>
                            {selectedIssue.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedIssue.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                selectedIssue.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-blue-500/20 text-blue-400'
                            }`}>
                            {selectedIssue.priority.toUpperCase()} PRIORITY
                        </span>
                    </div>

                    {/* User Info */}
                    <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">User Information</h3>
                        <p className="font-bold">{selectedIssue.userName}</p>
                        <p className="text-sm text-slate-400">{selectedIssue.userEmail}</p>
                    </div>

                    {/* Issue Details */}
                    <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Issue Details</h3>
                        <p className="text-xs text-slate-500 mb-2">{selectedIssue.type.toUpperCase()}</p>
                        <h4 className="font-bold text-lg mb-3">{selectedIssue.title}</h4>
                        <p className="text-slate-300 leading-relaxed">{selectedIssue.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleStatusChange(selectedIssue.id, 'in_progress')}
                                className="py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg font-bold transition-colors"
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => handleStatusChange(selectedIssue.id, 'resolved')}
                                className="py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-bold transition-colors"
                            >
                                Resolve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            <div className="p-4 border-b border-white/10">
                <h1 className="text-2xl font-bold mb-4">Support Issues</h1>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto">
                    {[
                        { value: 'all', label: 'All' },
                        { value: 'open', label: 'Open' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'resolved', label: 'Resolved' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value as any)}
                            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${filter === tab.value
                                    ? 'bg-primary text-black'
                                    : 'bg-surface-dark text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">inbox</span>
                        <p className="text-slate-400">No issues found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredIssues.map((issue) => (
                            <button
                                key={issue.id}
                                onClick={() => setSelectedIssue(issue)}
                                className="w-full bg-surface-dark p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all text-left"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-bold mb-1">{issue.title}</h3>
                                        <p className="text-sm text-slate-400">{issue.userName}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${issue.status === 'open' ? 'bg-red-500/20 text-red-400' :
                                            issue.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
