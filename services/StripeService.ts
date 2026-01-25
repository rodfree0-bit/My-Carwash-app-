import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

export class StripeService {
    static async createSetupIntent(): Promise<string> {
        const createSetupIntent = httpsCallable(functions, 'createStripeSetupIntent');
        const result = await createSetupIntent();
        const data = result.data as any;
        if (data.error) throw new Error(data.error);
        return data.clientSecret;
    }

    static async listPaymentMethods() {
        try {
            const listPaymentMethods = httpsCallable(functions, 'listStripePaymentMethods');
            const result = await listPaymentMethods();
            const data = result.data as any;
            if (data.error) throw new Error(data.error);
            return data.paymentMethods;
        } catch (err: any) {
            console.error('🔴 StripeService.listPaymentMethods error:', {
                code: err.code,
                message: err.message,
                details: err.details,
                full: err
            });
            throw err;
        }
    }

    static async deletePaymentMethod(paymentMethodId: string) {
        const deletePaymentMethod = httpsCallable(functions, 'deleteStripePaymentMethod');
        const result = await deletePaymentMethod({ paymentMethodId });
        const data = result.data as any;
        if (data.error) throw new Error(data.error);
        return data.success;
    }

    static async createPayment(amount: number, paymentMethodId: string, orderId: string) {
        const createPayment = httpsCallable(functions, 'createStripePayment');
        const result = await createPayment({ amount, paymentMethodId, orderId });
        const data = result.data as any;
        if (data.error) throw new Error(data.error);
        return data;
    }

    static async refundPayment(orderId: string, paymentIntentId: string, reason?: string) {
        const refundPayment = httpsCallable(functions, 'refundStripePayment');
        const result = await refundPayment({ orderId, paymentIntentId, reason });
        const data = result.data as any;
        if (data.error) throw new Error(data.error);
        return data;
    }
}
