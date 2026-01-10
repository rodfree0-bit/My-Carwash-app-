import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Cloud Function que se ejecuta cuando se ACTUALIZA una orden
 * Envía notificaciones push a CLIENTE y WASHER según el cambio de estado
 */
export const onOrderUpdated = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const orderId = context.params.orderId;

        // Detect what changed
        const statusChanged = before.status !== after.status;
        const washerAssigned = !before.washerId && after.washerId;
        const orderCancelled = after.status === 'Cancelled';

        console.log(`📝 Order updated: ${orderId}`);
        console.log(`   Status: ${before.status} → ${after.status}`);
        console.log(`   Washer: ${before.washerId || 'none'} → ${after.washerId || 'none'}`);

        try {
            const notifications: Promise<any>[] = [];

            // 1. WASHER ASSIGNED - Notify both client and washer
            if (washerAssigned && after.washerId) {
                console.log(`👷 Washer assigned: ${after.washerName} (${after.washerId})`);

                // Notify CLIENT
                const clientDoc = await admin.firestore().collection('users').doc(after.clientId).get();
                const clientToken = clientDoc.data()?.fcmToken;
                if (clientToken) {
                    notifications.push(
                        admin.messaging().send({
                            token: clientToken,
                            notification: {
                                title: '👷 Washer Assigned!',
                                body: `${after.washerName} has been assigned to your order.`
                            },
                            data: {
                                type: 'washer_assigned',
                                orderId: orderId,
                                userId: after.clientId, // Target client
                                targetRole: 'client',
                                washerId: after.washerId,
                                screen: 'CLIENT_ORDERS'
                            },
                            android: { priority: 'high' as const }
                        })
                    );
                }

                // Notify WASHER
                const washerDoc = await admin.firestore().collection('users').doc(after.washerId).get();
                const washerToken = washerDoc.data()?.fcmToken;
                if (washerToken) {
                    notifications.push(
                        admin.messaging().send({
                            token: washerToken,
                            notification: {
                                title: '🚗 New Job Assigned!',
                                body: `You've been assigned to wash ${after.vehicle} for ${after.clientName}.`
                            },
                            data: {
                                type: 'job_assigned',
                                orderId: orderId,
                                userId: after.washerId, // Target washer
                                targetRole: 'washer',
                                screen: 'WASHER_JOBS'
                            },
                            android: { priority: 'high' as const }
                        })
                    );
                }
            }

            // 2. ORDER CANCELLED - Notify both if washer was assigned
            if (orderCancelled) {
                console.log(`❌ Order cancelled`);

                // Notify CLIENT
                const clientDoc = await admin.firestore().collection('users').doc(after.clientId).get();
                const clientToken = clientDoc.data()?.fcmToken;
                if (clientToken) {
                    notifications.push(
                        admin.messaging().send({
                            token: clientToken,
                            notification: {
                                title: '❌ Order Cancelled',
                                body: `Your order has been cancelled.`
                            },
                            data: {
                                type: 'order_cancelled',
                                orderId: orderId,
                                userId: after.clientId,
                                targetRole: 'client',
                                screen: 'CLIENT_ORDERS'
                            },
                            android: { priority: 'high' as const }
                        })
                    );
                }

                // Notify WASHER if assigned
                if (after.washerId) {
                    const washerDoc = await admin.firestore().collection('users').doc(after.washerId).get();
                    const washerToken = washerDoc.data()?.fcmToken;
                    if (washerToken) {
                        notifications.push(
                            admin.messaging().send({
                                token: washerToken,
                                notification: {
                                    title: '❌ Job Cancelled',
                                    body: `The job for ${after.clientName} has been cancelled.`
                                },
                                data: {
                                    type: 'job_cancelled',
                                    orderId: orderId,
                                    userId: after.washerId,
                                    targetRole: 'washer',
                                    screen: 'WASHER_JOBS'
                                },
                                android: { priority: 'high' as const }
                            })
                        );
                    }
                }
            }

            // 3. STATUS CHANGED - Notify both client and washer
            if (statusChanged && !orderCancelled && after.status !== 'Pending') {
                const statusMessages: Record<string, { client: string; washer: string }> = {
                    'Assigned': {
                        client: 'Your order has been assigned to a washer.',
                        washer: 'You have been assigned a new job.'
                    },
                    'En Route': {
                        client: `${after.washerName} is on the way!`,
                        washer: 'Don\'t forget to update your status when you arrive.'
                    },
                    'Arrived': {
                        client: `${after.washerName} has arrived at your location.`,
                        washer: 'You have arrived. Waiting for client authorization.'
                    },
                    'In Progress': {
                        client: `${after.washerName} has started washing your car.`,
                        washer: 'Service in progress. Good luck!'
                    },
                    'Completed': {
                        client: 'Your car wash is complete! Please rate your experience.',
                        washer: 'Job completed! Waiting for client confirmation.'
                    }
                };

                const messages = statusMessages[after.status];
                if (messages) {
                    // Notify CLIENT
                    const clientDoc = await admin.firestore().collection('users').doc(after.clientId).get();
                    const clientToken = clientDoc.data()?.fcmToken;
                    if (clientToken) {
                        notifications.push(
                            admin.messaging().send({
                                token: clientToken,
                                notification: {
                                    title: `Order Status: ${after.status}`,
                                    body: messages.client
                                },
                                data: {
                                    type: 'status_update',
                                    orderId: orderId,
                                    userId: after.clientId,
                                    targetRole: 'client',
                                    status: after.status,
                                    screen: 'CLIENT_ORDERS'
                                },
                                android: { priority: 'high' as const }
                            })
                        );
                    }

                    // Notify WASHER if assigned
                    if (after.washerId) {
                        const washerDoc = await admin.firestore().collection('users').doc(after.washerId).get();
                        const washerToken = washerDoc.data()?.fcmToken;
                        if (washerToken) {
                            notifications.push(
                                admin.messaging().send({
                                    token: washerToken,
                                    notification: {
                                        title: `Job Status: ${after.status}`,
                                        body: messages.washer
                                    },
                                    data: {
                                        type: 'job_status_update',
                                        orderId: orderId,
                                        userId: after.washerId,
                                        targetRole: 'washer',
                                        status: after.status,
                                        screen: 'WASHER_JOBS'
                                    },
                                    android: { priority: 'high' as const }
                                })
                            );
                        }
                    }
                }
            }

            // Send all notifications
            if (notifications.length > 0) {
                await Promise.all(notifications);
                console.log(`✅ Sent ${notifications.length} notification(s)`);
            } else {
                console.log(`ℹ️ No notifications to send`);
            }

            return { success: true, notificationsSent: notifications.length };
        } catch (error) {
            console.error('❌ Error sending order update notifications:', error);
            return null;
        }
    });
