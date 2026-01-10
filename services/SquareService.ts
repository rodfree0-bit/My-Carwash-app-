/**
 * Servicio para interactuar con Firebase Functions de Square
 * Incluye autenticación automática
 */

import { auth } from '../firebase';

export interface CreateSquarePaymentResponse {
    paymentId: string;
    orderId: string;
    amount: number;
    status: string;
}

export interface CompleteSquarePaymentResponse {
    success: boolean;
    paymentId: string;
    amount: number;
    orderId: string;
}

export interface CancelOrderResponse {
    success: boolean;
    cancelled: boolean;
    fee: number;
    message: string;
}

// IMPORTANT: Replace YOUR_PROJECT_ID with your actual Firebase project ID
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';

/**
 * Obtiene el token de autenticación actual
 */
async function getAuthToken(): Promise<string | null> {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn('⚠️ No authenticated user for Square payment');
            return null;
        }
        return await user.getIdToken();
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

export class SquareService {
    /**
     * Creates a Square Payment (authorizes payment without completing)
     */
    static async createPayment(
        amount: number,
        orderId: string,
        sourceId: string, // Token from Square Web Payments SDK
        clientEmail: string,
        clientName: string
    ): Promise<CreateSquarePaymentResponse> {
        const authToken = await getAuthToken();
        if (!authToken) {
            throw new Error('You must be logged in to make a payment');
        }

        const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/createSquarePayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                amount,
                orderId,
                sourceId,
                clientEmail,
                clientName,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error || 'Failed to create payment');
        }

        return response.json();
    }

    /**
     * Completes the payment (when service is completed with tip)
     */
    static async completePayment(
        paymentId: string,
        orderId: string,
        tipAmount: number
    ): Promise<CompleteSquarePaymentResponse> {
        const authToken = await getAuthToken();
        if (!authToken) {
            throw new Error('You must be logged in to complete the payment');
        }

        const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/completeSquarePayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                paymentId,
                orderId,
                tipAmount,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error || 'Failed to complete payment');
        }

        return response.json();
    }

    /**
     * Cancels an order with conditional fee
     */
    static async cancelOrderWithFee(
        paymentId: string,
        orderId: string,
        washerAssigned: boolean,
        originalAmount: number
    ): Promise<CancelOrderResponse> {
        const authToken = await getAuthToken();
        if (!authToken) {
            throw new Error('You must be logged in to cancel an order');
        }

        const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/cancelSquareOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                paymentId,
                orderId,
                washerAssigned,
                originalAmount,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error || 'Failed to cancel order');
        }

        return response.json();
    }
}
