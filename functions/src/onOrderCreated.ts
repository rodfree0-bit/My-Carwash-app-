import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Cloud Function que se ejecuta cuando se CREA una nueva orden
 * Envía notificación push al CLIENTE que creó la orden
 */
export const onOrderCreated = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const order = snap.data();
        const orderId = context.params.orderId;

        console.log(`📦 New order created: ${orderId}`);
        console.log(`   Client: ${order.clientName} (${order.clientId})`);
        console.log(`   Service: ${order.service}`);
        console.log(`   Status: ${order.status}`);

        try {
            // Get client's FCM token
            const clientDoc = await admin.firestore().collection('users').doc(order.clientId).get();
            const clientData = clientDoc.data();
            const fcmToken = clientData?.fcmToken;

            if (!fcmToken) {
                console.log(`⚠️ No FCM token found for client ${order.clientId}`);
                return null;
            }

            // Send notification to CLIENT
            const message = {
                token: fcmToken,
                notification: {
                    title: '✅ Order Confirmed!',
                    body: `Your ${order.service} order has been created. We'll notify you when a washer is assigned.`
                },
                data: {
                    type: 'order_created',
                    orderId: orderId,
                    userId: order.clientId, // CRITICAL: Target specific user
                    targetRole: 'client',
                    screen: 'CLIENT_ORDERS'
                },
                android: {
                    priority: 'high' as const,
                    notification: {
                        channelId: 'orders',
                        priority: 'high' as const,
                        sound: 'default'
                    }
                }
            };

            await admin.messaging().send(message);
            console.log(`✅ Notification sent to client ${order.clientId}`);

            return { success: true };
        } catch (error) {
            console.error('❌ Error sending order created notification:', error);
            return null;
        }
    });
