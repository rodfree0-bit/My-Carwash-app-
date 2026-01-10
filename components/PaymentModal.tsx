import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of component render
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: () => void;
}

const CheckoutForm: React.FC<{ amount: number, onSuccess: () => void, onClose: () => void }> = ({ amount, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'card' | 'success'>('card');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        // For this demo 'Serverless' client-side only integration:
        // We create a Token to prove we can tokenize the card.
        // In a real backend flow, you'd create a PaymentIntent and confirm it.
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found');
            setProcessing(false);
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            elements,
            params: { type: 'card' }
        } as any);

        if (error) {
            setError(error.message || 'Payment failed');
            setProcessing(false);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            // Simulate server confirmation of payment method
            setTimeout(() => {
                setProcessing(false);
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }, 1000);
        }
    };

    if (step === 'success') {
        return (
            <div className="py-10 text-center flex flex-col items-center animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl">check</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Payment Successful!</h3>
                <p className="text-slate-500 text-sm">Your order has been confirmed.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
                <p className="text-slate-500 text-sm">Total Amount</p>
                <p className="text-4xl font-black text-slate-900">${amount.toFixed(2)}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>

            {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {processing ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">lock</span>}
                {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>

            <div className="flex justify-center gap-4 mt-4 opacity-50 grayscale">
                <span className="font-bold text-xs text-slate-400">POWERED BY STRIPE</span>
            </div>
        </form>
    );
};

export const PaymentModal: React.FC<PaymentModalProps> = (props) => {
    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600">secure_payment</span>
                        Secure Checkout
                    </h3>
                    <button onClick={props.onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm {...props} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};
