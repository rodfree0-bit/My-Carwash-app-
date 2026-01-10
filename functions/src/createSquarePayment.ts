/**
 * Firebase Cloud Function - Create Square Payment with Security
 * Includes authentication, rate limiting, and input validation
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const { Client } = require('square');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

interface CreatePaymentRequest {
    amount: number;
    orderId: string;
    sourceId: string;
    clientEmail: string;
    clientName: string;
}

/**
 * Verifica el token de autenticación de Firebase
 */
async function verifyAuth(req: functions.https.Request): Promise<{ uid: string; email: string } | null> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('⚠️ Missing or invalid authorization header');
            return null;
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || ''
        };
    } catch (error) {
        console.error('❌ Auth verification failed:', error);
        return null;
    }
}

/**
 * Verifica rate limiting para pagos
 */
async function checkPaymentRateLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
    try {
        const rateLimitRef = admin.firestore().doc(`rate_limits/${userId}_payment`);
        const rateLimitDoc = await rateLimitRef.get();

        const now = Date.now();
        const windowMs = 60 * 60 * 1000; // 1 hora
        const maxAttempts = 15; // 15 intentos por hora

        if (!rateLimitDoc.exists) {
            await rateLimitRef.set({
                count: 1,
                windowStart: admin.firestore.Timestamp.now(),
                lastAttempt: admin.firestore.Timestamp.now(),
                action: 'payment_attempt',
                userId
            });
            return { allowed: true };
        }

        const data = rateLimitDoc.data()!;
        const windowStartMs = data.windowStart.toMillis();
        const windowEndMs = windowStartMs + windowMs;

        // Si la ventana expiró, resetear
        if (now > windowEndMs) {
            await rateLimitRef.set({
                count: 1,
                windowStart: admin.firestore.Timestamp.now(),
                lastAttempt: admin.firestore.Timestamp.now(),
                action: 'payment_attempt',
                userId
            });
            return { allowed: true };
        }

        // Verificar límite
        if (data.count >= maxAttempts) {
            const minutesUntilReset = Math.ceil((windowEndMs - now) / (60 * 1000));
            return {
                allowed: false,
                message: `Too many payment attempts. Try again in ${minutesUntilReset} minutes.`
            };
        }

        // Incrementar contador
        await rateLimitRef.update({
            count: admin.firestore.FieldValue.increment(1),
            lastAttempt: admin.firestore.Timestamp.now()
        });

        return { allowed: true };
    } catch (error) {
        console.error('Error checking rate limit:', error);
        // En caso de error, permitir (fail-open)
        return { allowed: true };
    }
}

/**
 * Sanitiza y valida los datos de entrada
 */
function validateAndSanitizeInput(data: any): { valid: boolean; errors: string[]; sanitized?: CreatePaymentRequest } {
    const errors: string[] = [];

    // Validar amount
    if (typeof data.amount !== 'number' || data.amount <= 0 || data.amount > 10000) {
        errors.push('Invalid amount: must be between $0 and $10,000');
    }

    // Validar orderId
    if (!data.orderId || typeof data.orderId !== 'string' || data.orderId.length > 100) {
        errors.push('Invalid order ID');
    }

    // Validar sourceId
    if (!data.sourceId || typeof data.sourceId !== 'string') {
        errors.push('Invalid payment source');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.clientEmail || !emailRegex.test(data.clientEmail)) {
        errors.push('Invalid email address');
    }

    // Validar nombre
    if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.length > 200) {
        errors.push('Invalid client name');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    // Sanitizar datos
    const sanitized: CreatePaymentRequest = {
        amount: Number(data.amount.toFixed(2)),
        orderId: data.orderId.trim().substring(0, 100),
        sourceId: data.sourceId.trim(),
        clientEmail: data.clientEmail.trim().toLowerCase(),
        clientName: data.clientName.trim().substring(0, 200)
    };

    return { valid: true, errors: [], sanitized };
}

export const createSquarePayment = functions.https.onRequest(async (req, res) => {
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
            console.warn('⚠️ Unauthorized payment attempt');
            res.status(401).json({
                error: 'Unauthorized',
                message: 'You must be logged in to make a payment'
            });
            return;
        }

        console.log(`✅ Authenticated user: ${auth.uid}`);

        // 2. Verificar rate limiting
        const rateLimit = await checkPaymentRateLimit(auth.uid);
        if (!rateLimit.allowed) {
            console.warn(`⚠️ Rate limit exceeded for user ${auth.uid}`);
            res.status(429).json({
                error: 'Too Many Requests',
                message: rateLimit.message
            });
            return;
        }

        // 3. Validar y sanitizar entrada
        const validation = validateAndSanitizeInput(req.body);
        if (!validation.valid) {
            console.warn('⚠️ Invalid input:', validation.errors);
            res.status(400).json({
                error: 'Invalid Input',
                message: validation.errors.join(', ')
            });
            return;
        }

        const data = validation.sanitized!;

        // 4. Verificar que el usuario es dueño de la orden
        const orderRef = admin.firestore().doc(`orders/${data.orderId}`);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            res.status(404).json({
                error: 'Order not found',
                message: 'La orden no existe'
            });
            return;
        }

        const orderData = orderDoc.data()!;
        if (orderData.clientId !== auth.uid) {
            console.warn(`⚠️ User ${auth.uid} attempted to pay for order ${data.orderId} owned by ${orderData.clientId}`);
            res.status(403).json({
                error: 'Forbidden',
                message: 'No tienes permiso para pagar esta orden'
            });
            return;
        }

        // 5. Inicializar Square Client
        const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
        const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

        if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
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

        // 6. Crear pago en Square
        const amountInCents = Math.round(data.amount * 100);

        const { result } = await squareClient.paymentsApi.createPayment({
            sourceId: data.sourceId,
            amountMoney: {
                amount: BigInt(amountInCents),
                currency: 'USD',
            },
            locationId: SQUARE_LOCATION_ID,
            idempotencyKey: data.orderId,
            note: `Car Wash Service - Order ${data.orderId}`,
            buyerEmailAddress: data.clientEmail,
            autocomplete: false,
        });

        console.log(`✅ Square payment created: ${result.payment?.id} for order ${data.orderId}`);

        // 7. Log de seguridad
        await admin.firestore().collection('security_logs').add({
            type: 'payment_created',
            userId: auth.uid,
            orderId: data.orderId,
            paymentId: result.payment?.id,
            amount: data.amount,
            timestamp: admin.firestore.Timestamp.now(),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            paymentId: result.payment?.id,
            orderId: data.orderId,
            amount: data.amount,
            status: result.payment?.status
        });

    } catch (error: any) {
        console.error('❌ Error creating Square payment:', error);

        // Log de error de seguridad
        try {
            await admin.firestore().collection('security_logs').add({
                type: 'payment_error',
                error: error.message,
                timestamp: admin.firestore.Timestamp.now(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }

        // Handle specific Square error codes
        let errorMessage = 'Failed to process payment';
        let userMessage = 'Error al procesar el pago. Por favor intenta de nuevo.';

        if (error.errors && error.errors.length > 0) {
            const squareError = error.errors[0];

            switch (squareError.code) {
                case 'INSUFFICIENT_FUNDS':
                case 'CARD_DECLINED':
                    userMessage = 'Insufficient funds. Please use another payment method.';
                    errorMessage = 'Card declined - insufficient funds';
                    break;

                case 'INVALID_CARD':
                case 'INVALID_CARD_DATA':
                    userMessage = 'Invalid card. Please check your card details.';
                    errorMessage = 'Invalid card data';
                    break;

                case 'CVV_FAILURE':
                    userMessage = 'Invalid CVV. Please check your security code.';
                    errorMessage = 'CVV verification failed';
                    break;

                case 'EXPIRED_CARD':
                    userMessage = 'Card expired. Please use a different card.';
                    errorMessage = 'Card has expired';
                    break;

                case 'CARD_PROCESSING_NOT_ENABLED':
                case 'GENERIC_DECLINE':
                    userMessage = 'Payment declined. Please contact your bank.';
                    errorMessage = 'Card declined by issuer';
                    break;

                default:
                    userMessage = squareError.detail || 'Error processing payment.';
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
