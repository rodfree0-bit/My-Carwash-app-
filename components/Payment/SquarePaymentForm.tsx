import React, { useState, useEffect } from 'react';
import { loadSquareSDK, squareConfig } from '../../services/square-config';
import { SquareService } from '../../services/SquareService';

interface SquarePaymentFormProps {
    amount: number;
    orderId: string;
    clientEmail: string;
    clientName: string;
    onSuccess: (paymentId: string) => void;
    onError: (error: string) => void;
    onCancel: () => void;
}

export const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
    amount,
    orderId,
    clientEmail,
    clientName,
    onSuccess,
    onError,
    onCancel
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [card, setCard] = useState<any>(null);

    useEffect(() => {
        initializeSquare();
    }, []);

    const initializeSquare = async () => {
        try {
            const Square = await loadSquareSDK();
            const payments = Square.payments(squareConfig.applicationId, squareConfig.locationId);

            const cardInstance = await payments.card();
            await cardInstance.attach('#card-container');

            setCard(cardInstance);
            setIsLoading(false);
        } catch (error: any) {
            setErrorMessage(error.message || 'Error loading Square');
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!card) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // Tokenize card
            const result = await card.tokenize();

            if (result.status === 'OK') {
                // Create payment with Square
                const response = await SquareService.createPayment(
                    amount,
                    orderId,
                    result.token,
                    clientEmail,
                    clientName
                );

                onSuccess(response.paymentId);
            } else {
                setErrorMessage(result.errors?.[0]?.message || 'Error processing payment');
                onError(result.errors?.[0]?.message || 'Error processing payment');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Unexpected error');
            onError(err.message || 'Unexpected error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
                <p className="text-slate-400">Preparing secure payment...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Amount Display */}
            <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total to pay:</span>
                    <span className="text-2xl font-bold text-primary">${amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This amount will be authorized. Final charge will be made upon service completion.
                </p>
            </div>

            {/* Square Card Container */}
            <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                <div id="card-container"></div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-14 bg-primary rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined">lock</span>
                        Pay Now
                    </>
                )}
            </button>

            {/* Cancel Button */}
            <button
                onClick={onCancel}
                className="w-full h-12 bg-surface-dark border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span>Secure payment processed by Square</span>
            </div>
        </div>
    );
};
