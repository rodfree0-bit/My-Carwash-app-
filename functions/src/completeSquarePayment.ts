/**
 * Firebase Cloud Function - Complete Square Payment with Security
 * Includes authentication and validation
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const { Client } = require('square');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

interface CompletePaymentRequest {
    paymentId: string;
    orderId: string;
    tipAmount: number;
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

export const completeSquarePayment = functions.https.onRequest(async (req, res) => {
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
            console.warn('⚠️ Unauthorized payment completion attempt');
            res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to complete the payment'
            });
            return;
        }

        const data: CompletePaymentRequest = req.body;

        if (!data.paymentId || !data.orderId) {
            res.status(400).json({
                error: 'Missing required fields: paymentId, orderId'
            });
            return;
        }

        // Validar tipAmount
        if (typeof data.tipAmount !== 'number' || data.tipAmount < 0 || data.tipAmount > 1000) {
            res.status(400).json({
                error: 'Invalid tip amount',
                message: 'Tip amount must be between $0 and $1,000'
            });
            return;
        }

        // 2. Verificar que el usuario es washer asignado o admin
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
        const userRef = admin.firestore().doc(`users/${auth.uid}`);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        const isWasher = orderData.washerId === auth.uid;
        const isAdmin = userData?.role === 'admin';

        if (!isWasher && !isAdmin) {
            console.warn(`⚠️ User ${auth.uid} attempted to complete payment for order ${data.orderId}`);
            res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to complete this payment'
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

        // 4. Actualizar pago con propina si existe
        const tipInCents = Math.round(data.tipAmount * 100);

        if (data.tipAmount > 0) {
            await squareClient.paymentsApi.updatePayment(data.paymentId, {
                payment: {
                    tipMoney: {
                        amount: BigInt(tipInCents),
                        currency: 'USD',
                    },
                },
            });
        }

        // 5. Completar pago
        const { result } = await squareClient.paymentsApi.completePayment(data.paymentId);

        // 6. Actualizar orden en Firestore
        await orderRef.update({
            squarePaymentStatus: 'completed',
            capturedAmount: (Number(result.payment?.amountMoney?.amount || 0) + tipInCents) / 100,
            tip: data.tipAmount,
            paymentStatus: 'Paid',
        });

        console.log(`✅ Square payment completed: ${data.paymentId} for order ${data.orderId}`);

        // 7. Log de seguridad
        await admin.firestore().collection('security_logs').add({
            type: 'payment_completed',
            userId: auth.uid,
            orderId: data.orderId,
            paymentId: data.paymentId,
            tipAmount: data.tipAmount,
            timestamp: admin.firestore.Timestamp.now(),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            paymentId: data.paymentId,
            amount: (Number(result.payment?.totalMoney?.amount || 0)) / 100,
            orderId: data.orderId
        });

    } catch (error: any) {
        console.error('❌ Error completing Square payment:', error);

        // Log de error
        try {
            await admin.firestore().collection('security_logs').add({
                type: 'payment_completion_error',
                error: error.message,
                timestamp: admin.firestore.Timestamp.now(),
                ip: req.ip
            });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }

        // Handle specific Square error codes
        let errorMessage = 'Failed to complete payment';
        let userMessage = 'Error completing payment. Please contact support.';

        if (error.errors && error.errors.length > 0) {
            const squareError = error.errors[0];

            switch (squareError.code) {
                case 'INSUFFICIENT_FUNDS':
                    userMessage = 'Insufficient funds for tip. Payment completed without tip.';
                    errorMessage = 'Insufficient funds for tip amount';
                    break;

                case 'PAYMENT_AMOUNT_MISMATCH':
                    userMessage = 'Payment amount error. Please contact support.';
                    errorMessage = 'Payment amount mismatch';
                    break;

                default:
                    userMessage = squareError.detail || 'Error completing payment.';
                    errorMessage = squareError.code || 'Unknown error';
            }
        }

        res.status(400).json({
            error: errorMessage,
            message: userMessage,
            details: error.message
        });
    }
});
