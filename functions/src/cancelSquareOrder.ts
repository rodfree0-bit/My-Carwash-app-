/**
 * Firebase Cloud Function - Cancel Square Order with Security
 * Includes authentication and authorization
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const { Client } = require('square');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const CANCELLATION_FEE = 15.00;

interface CancelOrderRequest {
    paymentId: string;
    orderId: string;
    washerAssigned: boolean;
    originalAmount: number;
}

/**
 * Verifica el token de autenticación de Firebase
 */
async function verifyAuth(req: functions.https.Request): Promise<{ uid: string; email: string } | null> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || ''
        };
    } catch (error) {
        console.error('Auth verification failed:', error);
        return null;
    }
}

export const cancelSquareOrder = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // 1. Verificar autenticación
        const auth = await verifyAuth(req);
        if (!auth) {
            console.warn('⚠️ Unauthorized cancellation attempt');
            res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to cancel an order'
            });
            return;
        }

        const data: CancelOrderRequest = req.body;

        if (!data.paymentId || !data.orderId) {
            res.status(400).json({
                error: 'Missing required fields: paymentId, orderId'
            });
            return;
        }

        // Validar originalAmount
        if (typeof data.originalAmount !== 'number' || data.originalAmount <= 0) {
            res.status(400).json({
                error: 'Invalid original amount'
            });
            return;
        }

        // 2. Verificar que el usuario es dueño de la orden
        const orderRef = admin.firestore().doc(`orders/${data.orderId}`);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            res.status(404).json({
                error: 'Order not found',
                message: 'Order does not exist'
            });
            return;
        }

        const orderData = orderDoc.data()!;
        if (orderData.clientId !== auth.uid) {
            console.warn(`⚠️ User ${auth.uid} attempted to cancel order ${data.orderId} owned by ${orderData.clientId}`);
            res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to cancel this order'
            });
            return;
        }

        // 3. Inicializar Square Client
        const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

        if (!SQUARE_ACCESS_TOKEN) {
            console.error('❌ Square credentials not configured');
            res.status(500).json({
                error: 'Configuration Error',
                message: 'Payment system is not configured correctly'
            });
            return;
        }

        const squareClient = new Client({
            bearerAuthCredentials: {
                accessToken: SQUARE_ACCESS_TOKEN,
            },
            environment: 'sandbox',
        });

        // 4. Procesar cancelación según si hay washer asignado
        if (!data.washerAssigned) {
            // Sin washer asignado: cancelar sin cargo
            await squareClient.paymentsApi.cancelPayment(data.paymentId);

            await orderRef.update({
                status: 'Cancelled',
                squarePaymentStatus: 'cancelled',
                cancellationFee: 0,
                paymentStatus: 'Failed',
                cancelledAt: admin.firestore.Timestamp.now(),
                cancelledBy: auth.uid
            });

            console.log(`✅ Order ${data.orderId} cancelled without fee`);

            // Log de seguridad
            await admin.firestore().collection('security_logs').add({
                type: 'order_cancelled',
                userId: auth.uid,
                orderId: data.orderId,
                fee: 0,
                timestamp: admin.firestore.Timestamp.now(),
                ip: req.ip
            });

            res.status(200).json({
                success: true,
                cancelled: true,
                fee: 0,
                message: 'Order cancelled without charge'
            });

        } else {
            // Con washer asignado: cobrar $15
            const feeInCents = Math.round(CANCELLATION_FEE * 100);

            await squareClient.paymentsApi.updatePayment(data.paymentId, {
                payment: {
                    amountMoney: {
                        amount: BigInt(feeInCents),
                        currency: 'USD',
                    },
                },
            });

            const { result } = await squareClient.paymentsApi.completePayment(data.paymentId);

            await orderRef.update({
                status: 'Cancelled',
                squarePaymentStatus: 'completed',
                cancellationFee: CANCELLATION_FEE,
                capturedAmount: CANCELLATION_FEE,
                refundAmount: data.originalAmount - CANCELLATION_FEE,
                paymentStatus: 'Paid',
                cancelledAt: admin.firestore.Timestamp.now(),
                cancelledBy: auth.uid
            });

            console.log(`✅ Order ${data.orderId} cancelled with $${CANCELLATION_FEE} fee`);

            // Log de seguridad
            await admin.firestore().collection('security_logs').add({
                type: 'order_cancelled_with_fee',
                userId: auth.uid,
                orderId: data.orderId,
                fee: CANCELLATION_FEE,
                paymentId: result.payment?.id,
                timestamp: admin.firestore.Timestamp.now(),
                ip: req.ip
            });

            res.status(200).json({
                success: true,
                cancelled: true,
                fee: CANCELLATION_FEE,
                paymentId: result.payment?.id,
                message: `Order cancelled. Cancellation fee: $${CANCELLATION_FEE}.`
            });
        }

    } catch (error: any) {
        console.error('❌ Error cancelling Square order:', error);

        // Log de error
        try {
            await admin.firestore().collection('security_logs').add({
                type: 'order_cancellation_error',
                error: error.message,
                timestamp: admin.firestore.Timestamp.now(),
                ip: req.ip
            });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }

        res.status(500).json({
            error: 'Failed to cancel order',
            message: 'Error cancelling order. Please contact support.',
            details: error.message
        });
    }
});
