import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

export class StripeService {
    private static async secureFetch(functionName: string, data: any = {}) {
        const { auth } = await import('../firebase');
        if (!auth.currentUser) throw new Error("User not authenticated");
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(`https://us-central1-my-carwashapp-e6aba.cloudfunctions.net/${functionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        if (result.error) throw new Error(typeof result.error === 'string' ? result.error : result.error.message);
        return result.data;
    }

    static async createSetupIntent(): Promise<string> {
        const data = await this.secureFetch('createStripeSetupIntent');
        return data.clientSecret;
    }

    static async listPaymentMethods() {
        const data = await this.secureFetch('listStripePaymentMethods');
        return data.paymentMethods || [];
    }

    static async deletePaymentMethod(paymentMethodId: string) {
        const data = await this.secureFetch('deleteStripePaymentMethod', { paymentMethodId });
        return data.success;
    }

    static async createPayment(amount: number, paymentMethodId: string, orderId: string) {
        console.log(`💳 Initiating secure payment of $${amount} for order ${orderId}...`);
        return await this.secureFetch('createStripePayment', { amount, paymentMethodId, orderId });
    }

    static async refundPayment(orderId: string, paymentIntentId: string, reason?: string) {
        return await this.secureFetch('refundStripePayment', { orderId, paymentIntentId, reason });
    }

    static async updateWasherRating(washerId: string, newRating: number) {
        console.log(`⭐ Sending washer rating update to server for ${washerId}...`);
        return await this.secureFetch('updateWasherRating', { washerId, newRating });
    }
}
