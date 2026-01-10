import React from 'react';

interface LegalModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    content: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({ title, isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-surface-dark rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-sm leading-relaxed space-y-4 custom-scrollbar">
                    {content === 'terms' ? <TermsOfServiceStrict /> : <PrivacyPolicyStrict />}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 flex justify-end bg-surface-dark rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors active:scale-[0.98]"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

const TermsOfServiceStrict = () => (
    <>
        <h3 className="text-white font-bold text-lg mb-2">1. ACCEPTANCE OF TERMS</h3>
        <p>By accessing or using the My Carwash App service ("Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and My Carwash App. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.</p>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">2. SERVICE LIMITATIONS & LIABILITY</h3>
        <p className="uppercase font-bold text-xs text-red-400 mb-1">PLEASE READ CAREFULLY</p>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MY CARWASH APP AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS AND LICENSORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.</p>
        <p className="mt-2">We are NOT responsible for:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Pre-existing damage to vehicles, known or unknown.</li>
            <li>Damage caused by loose items left inside the vehicle.</li>
            <li>Mechanical malfunctions or electrical issues that occur during or after service.</li>
            <li>Damage to non-original equipment (aftermarket parts) or customized vehicle wraps/films.</li>
            <li>Loss of personal property left in the vehicle.</li>
        </ul>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">3. CANCELLATION & FEES</h3>
        <p>You acknowledge that time is reserved specifically for your appointment.</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Cancellation Fee:</strong> If an order is cancelled after a washer has been assigned, a cancellation fee of <strong>$15.00</strong> will be charged to compensate the washer for their time and travel.</li>
            <li><strong>Waiting Time:</strong> We offer a 10-minute grace period upon arrival. If the washer is kept waiting beyond 10 minutes, a waiting fee of <strong>$10.00</strong> will be charged.</li>
            <li><strong>No-Shows:</strong> If we cannot access the vehicle or contact you after the grace period, it may be considered a cancellation subject to the fees above.</li>
        </ul>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">4. INDEMNIFICATION</h3>
        <p>You agree to indemnify and hold My Carwash App harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these Terms or your violation of any law or the rights of a third party.</p>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">5. SERVICE REFUSAL</h3>
        <p>We reserve the right to refuse service to anyone for any reason at any time, including but not limited to vehicles in unsafe condition, biohazards present in the vehicle, or abusive behavior towards our staff.</p>
    </>
);

const PrivacyPolicyStrict = () => (
    <>
        <h3 className="text-white font-bold text-lg mb-2">1. DATA COLLECTION</h3>
        <p>We collect information you provide directly to us, such as your name, email address, phone number, vehicle information, and payment information. We also automatically collect location data when you use the Service to facilitate washer arrival.</p>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">2. USE OF INFORMATION</h3>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and send related information, including confirmations and receipts.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
        </ul>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">3. INFORMATION SHARING</h3>
        <p>We may share aggregated or de-identified information, which cannot reasonably be used to identify you. We do not sell your personal data to third parties. We may disclose your information if required by law or to protect the rights and safety of My Carwash App or others.</p>

        <h3 className="text-white font-bold text-lg mb-2 mt-4">4. LOCATION SERVICES</h3>
        <p>To use our services, you must authorize the collection of location data. This data is used to coordinate service delivery time and location. You may stop sharing location data at any time by adjusting your device settings, but this will limit your ability to use the Service.</p>
    </>
);
