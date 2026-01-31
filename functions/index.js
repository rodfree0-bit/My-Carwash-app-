const functions = require("firebase-functions/v1");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

// Inicializar solo si no está inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Helper para enviar notificaciones push
 */
async function sendNotification(userId, title, body, data = {}) {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.log(`Usuario ${userId} no encontrado.`);
            return;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log(`Usuario ${userId} no tiene FCM Token.`);
            return;
        }

        const message = {
            notification: {
                title: title,
                body: body
            },
            token: fcmToken,
            data: data,
            android: {
                priority: 'high',
                notification: {
                    channelId: 'orders',
                    priority: 'high',
                    sound: 'default'
                }
            }
        };

        const response = await messaging.send(message);
        console.log(`✅ Notificación enviada a ${userId}:`, response);
    } catch (error) {
        console.error("❌ Error enviando notificación:", error);
    }
}

async function getOrCreateStripeCustomer(uid, email, role) {
    const userSnapshot = await db.collection('users').doc(uid).get();
    const userData = userSnapshot.data();

    if (userData && userData.stripeCustomerId) {
        return userData.stripeCustomerId;
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY || (functions.config().stripe && functions.config().stripe.secret) || 'sk_test_placeholder';
    const stripe = require('stripe')(stripeSecret);

    const customer = await stripe.customers.create({
        email: email,
        metadata: { firebaseUID: uid, role: role }
    });

    await db.collection('users').doc(uid).set({ stripeCustomerId: customer.id }, { merge: true });
    return customer.id;
}

// Configuración CORS
const cors = require('cors')({ origin: true });

// Helper para envolver funciones HTTPS con seguridad (Firebase V1 compatible)
const handleSecureRequest = (handler) => (req, res) => {
    cors(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.status(204).send('');
            return;
        }

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).send({ error: 'Unauthenticated' });
            }

            const idToken = authHeader.split('Bearer ')[1];
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            const result = await handler(req.body.data || req.body, {
                auth: { uid: decodedToken.uid, token: decodedToken }
            });

            res.status(200).send({ data: result });
        } catch (error) {
            console.error('Secure Request Error:', error);
            res.status(500).send({ error: error.message });
        }
    });
};

// 1. NEW ORDER CREATED (Notify all Washers)
exports.onNewOrderCreated = functions.region('us-central1').firestore
    .document('orders/{orderId}')
    .onCreate(async (snapshot, context) => {
        const orderData = snapshot.data();
        const orderId = context.params.orderId;

        console.log(`🆕 New order detected: ${orderId}`);

        // Extract city from address
        const address = orderData.address || "";
        const cityMatch = address.match(/,\s*([^,]+),\s*[A-Z]{2}\s*\d{5}/) || address.match(/,\s*([^,]+),/);
        const location = cityMatch ? cityMatch[1] : (address.split(',')[0] || "Unknown");
        const total = orderData.price || 0;

        // Query ALL Washers
        const washersSnapshot = await db.collection("users")
            .where("role", "==", "washer")
            .get();

        const notifications = [];

        // Notify Washers
        washersSnapshot.forEach((doc) => {
            notifications.push(sendNotification(doc.id, "🆕 New Job Available!",
                `New order in ${location} $${total}. Check available orders!`,
                {
                    type: "new_order",
                    orderId: orderId,
                    screen: "WASHER_JOBS"
                }
            ));
        });

        // Notify Admins
        const adminsSnapshot = await db.collection("users")
            .where("role", "==", "admin")
            .get();

        adminsSnapshot.forEach((doc) => {
            notifications.push(sendNotification(doc.id, "💼 New Order Received",
                `${orderData.clientName} ordered ${orderData.service}`,
                { type: "new_order", orderId: orderId, screen: "ADMIN_DASHBOARD" }
            ));
        });

        await Promise.all(notifications);
        return null;
    });

// 2. ORDER STATUS UPDATED (Targeted Notifications)
exports.onOrderStatusUpdated = functions.region('us-central1').firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Only proceed if status changed
        if (newData.status === oldData.status) return null;

        const orderId = context.params.orderId;
        const clientId = newData.clientId;
        const washerId = newData.washerId;

        let title = "", body = "", targetUserId = "";

        // A. Washer Assigned
        if (newData.status === "Assigned" && oldData.status === "Pending") {
            // Notify Client
            await sendNotification(clientId, "Washer Assigned! 🚗",
                `${newData.washerName || 'A washer'} has picked up your order.`,
                { type: "order_update", orderId: orderId, screen: "CLIENT_ORDERS" });

            // Notify the specific Washer who took it (Confirmation)
            if (washerId) {
                await sendNotification(washerId, "Order Confirmed!",
                    `The job for ${newData.clientName} is now yours.`,
                    { type: "job_assigned", orderId: orderId, screen: "WASHER_JOBS" });
            }
        }
        // B. En Route
        else if (newData.status === "En Route") {
            title = "Washer En Route! 📍";
            body = `${newData.washerName || 'Your washer'} is on the way.`;
            targetUserId = clientId;
        }
        // C. Arrived
        else if (newData.status === "Arrived") {
            title = "Washer Arrived! 👋";
            body = `${newData.washerName || 'The washer'} has arrived.`;
            targetUserId = clientId;
        }
        // D. Washing / In Progress
        else if (newData.status === "Washing" || newData.status === "In Progress") {
            title = "Service Started 🧼";
            body = "We are currently washing your vehicle.";
            targetUserId = clientId;
        }
        // E. Completed
        else if (newData.status === "Completed") {
            title = "All Done! ✨";
            body = "Service finished. Please rate your experience!";
            targetUserId = clientId;
        }
        // F. Cancelled (FIXED TARGETING)
        else if (newData.status === "Cancelled") {
            const cancelReason = newData.cancelReason || "No reason provided";

            // 1. If washer was assigned, notify WASHER
            if (washerId) {
                await sendNotification(washerId, "Order Cancelled ❌",
                    `The job for ${newData.clientName} has been cancelled. Reason: ${cancelReason}`,
                    { type: "job_cancelled", orderId: orderId, screen: "WASHER_JOBS" });
            }

            // 2. Notify CLIENT (Confirmation)
            title = "Order Cancelled ❌";
            body = `Your order #${orderId.substring(0, 8)} has been cancelled.`;
            targetUserId = clientId;
        }

        // Send final notification to primary target (usually client)
        if (targetUserId && title) {
            await sendNotification(targetUserId, title, body,
                { type: "order_update", orderId: orderId });
        }

        return null;
    });

// 3. NEW MESSAGE (Targeted Chat Notification)
exports.onNewMessage = functions.region('us-central1').firestore
    .document('messages/{messageId}')
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.data();
        const recipientId = messageData.recipientId;

        if (!recipientId) return null;

        // Identify sender name
        const senderDoc = await db.collection("users").doc(messageData.senderId).get();
        const senderName = senderDoc.exists ? (senderDoc.data().name || "Someone") : "Someone";

        // Notify ONLY the recipient
        await sendNotification(recipientId, `💬 ${senderName}`,
            messageData.text || "Sent you a message",
            {
                type: "new_message",
                orderId: messageData.orderId || "",
                senderId: messageData.senderId
            }
        );

        return null;
    });

// 4. SUPPORT MESSAGE (Legacy Support Trigger)
exports.onSupportMessage = functions.region('us-central1').firestore
    .document('supportTickets/{tId}/messages/{mId}')
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.data();
        const recipientId = messageData.recipientId;
        if (!recipientId) return null;

        await sendNotification(recipientId, "Support Message 💬",
            messageData.text || "New support reply",
            { type: "support_message", ticketId: context.params.tId });

        return null;
    });

// ---------------------------------------------------------
// HTTPS CALLABLE / REQUEST (V1 for Stripe compatibility)
// ---------------------------------------------------------

exports.createStripeSetupIntent = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        const stripeCustomerId = await getOrCreateStripeCustomer(context.auth.uid, context.auth.token.email, 'Client');
        const stripeSecret = process.env.STRIPE_SECRET_KEY || (functions.config().stripe && functions.config().stripe.secret) || 'sk_test_placeholder';
        const stripe = require('stripe')(stripeSecret);
        const setupIntent = await stripe.setupIntents.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
        });
        return { clientSecret: setupIntent.client_secret };
    })
);

exports.listStripePaymentMethods = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        const uid = context.auth.uid;
        const userDoc = await db.collection('users').doc(uid).get();
        const stripeCustomerId = userDoc.data()?.stripeCustomerId;

        if (!stripeCustomerId) return { paymentMethods: [] };

        const stripeSecret = process.env.STRIPE_SECRET_KEY || (functions.config().stripe && functions.config().stripe.secret) || 'sk_test_placeholder';
        const stripe = require('stripe')(stripeSecret);

        const paymentMethods = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' });
        const formatted = paymentMethods.data.map(pm => ({
            id: pm.id,
            brand: pm.card.brand,
            last4: pm.card.last4,
            expiry: `${pm.card.exp_month}/${pm.card.exp_year.toString().slice(-2)}`
        }));
        return { paymentMethods: formatted };
    })
);

exports.deleteStripePaymentMethod = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        const { paymentMethodId } = data;
        const stripeSecret = process.env.STRIPE_SECRET_KEY || (functions.config().stripe && functions.config().stripe.secret) || 'sk_test_placeholder';
        const stripe = require('stripe')(stripeSecret);
        await stripe.paymentMethods.detach(paymentMethodId);
        return { success: true };
    })
);

exports.createStripePayment = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        const { amount, paymentMethodId, orderId } = data;
        const stripeCustomerId = await getOrCreateStripeCustomer(context.auth.uid, context.auth.token.email, 'Client');
        const stripeSecret = process.env.STRIPE_SECRET_KEY || (functions.config().stripe && functions.config().stripe.secret) || 'sk_test_placeholder';
        const stripe = require('stripe')(stripeSecret);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            customer: stripeCustomerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
            metadata: { orderId, firebaseUID: context.auth.uid }
        });
        await db.collection('orders').doc(orderId).update({ paymentStatus: 'paid', paymentId: paymentIntent.id });
        return { success: true, paymentId: paymentIntent.id };
    })
);

exports.calculateRouteETA = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        // Mock implementation
        return { duration: 15, distance: 5.5, status: 'OK' };
    })
);

exports.updateWasherRating = functions.region('us-central1').https.onRequest(
    handleSecureRequest(async (data, context) => {
        const { washerId, newRating } = data;
        const snapshot = await db.collection('orders').where('washerId', '==', washerId).where('status', '==', 'Completed').get();
        let total = 0, count = 0;
        snapshot.forEach(doc => { if (doc.data().rating) { total += doc.data().rating; count++; } });
        const average = count > 0 ? total / count : newRating;
        await db.collection('users').doc(washerId).update({ rating: parseFloat(average.toFixed(1)), completedJobs: count });
        return { success: true, averageRating: average };
    })
);
