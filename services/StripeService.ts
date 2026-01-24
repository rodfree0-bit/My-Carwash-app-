import { auth } from '../firebase';

const FUNCTIONS_URL = 'https://us-central1-my-carwashapp-e6aba.cloudfunctions.net';

export class StripeService {
    private static async getAuthHeader() {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const token = await user.getIdToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    static async createSetupIntent(): Promise<string> {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${FUNCTIONS_URL}/createStripeSetupIntent`, {
            method: 'POST',
            headers
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.clientSecret;
    }

    static async listPaymentMethods() {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${FUNCTIONS_URL}/listStripePaymentMethods`, {
            method: 'POST',
            headers
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.paymentMethods;
    }

    static async deletePaymentMethod(paymentMethodId: string) {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${FUNCTIONS_URL}/deleteStripePaymentMethod`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ paymentMethodId })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.success;
    }

    static async createPayment(amount: number, paymentMethodId: string, orderId: string) {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${FUNCTIONS_URL}/createStripePayment`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount, paymentMethodId, orderId })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    }

    static async refundPayment(orderId: string, paymentIntentId: string, reason?: string) {
        const headers = await this.getAuthHeader();
        const response = await fetch(`${FUNCTIONS_URL}/refundStripePayment`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ orderId, paymentIntentId, reason })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    }
}
