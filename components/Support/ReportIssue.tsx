import React, { useState } from 'react';
import { issueService } from '../../services/issueService';

interface ReportIssueProps {
    currentUser: any;
    onClose: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ReportIssue: React.FC<ReportIssueProps> = ({ currentUser, onClose, showToast }) => {
    const [type, setType] = useState<'technical' | 'payment' | 'service' | 'other'>('technical');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await issueService.createIssue({
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                type,
                title,
                description,
                status: 'open',
                priority: 'medium',
            });

            showToast('Issue reported successfully! We will contact you soon.', 'success');
            onClose();
        } catch (error: any) {
            showToast(error.message || 'Failed to report issue', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-surface-dark w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Report an Issue</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Issue Type */}
                    <div>
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-3">Issue Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'technical', label: 'Technical Problem', icon: 'bug_report' },
                                { value: 'payment', label: 'Payment Issue', icon: 'payment' },
                                { value: 'service', label: 'Service Quality', icon: 'star' },
                                { value: 'other', label: 'Other', icon: 'help' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setType(option.value as any)}
                                    className={`p-4 rounded-xl border-2 transition-all ${type === option.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-2xl mb-2">{option.icon}</span>
                                    <p className="text-sm font-bold">{option.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief description of the issue"
                            className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs uppercase text-slate-400 font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide as much detail as possible..."
                            rows={6}
                            className="w-full bg-surface-dark border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Issue'}
                    </button>
                </form>
            </div>
        </div>
    );
};
