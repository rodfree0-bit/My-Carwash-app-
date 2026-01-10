import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Cloud Function que se ejecuta cada minuto para:
 * 1. Enviar notificaciones a clientes que tienen washer esperando
 * 2. Calcular cargos por tiempo de espera ($10 cada 10 minutos después del primer bloque)
 */
export const notifyWaitingTime = functions.pubsub
    .schedule('every 1 minutes')
    .timeZone('America/Los_Angeles')
    .onRun(async (context: functions.EventContext) => {
        const db = admin.firestore();
        const now = Date.now();

        try {
            // Buscar órdenes donde washer está esperando autorización
            const ordersSnapshot = await db.collection('orders')
                .where('status', '==', 'Arrived')
                .where('waitingForClient', '==', true)
                .where('clientAuthorized', '==', false)
                .get();

            console.log(`Found ${ordersSnapshot.size} orders with waiting washers`);

            for (const orderDoc of ordersSnapshot.docs) {
                const order = orderDoc.data();
                const waitingStartTime = order.waitingStartTime || order.arrivedAt || now;
                const waitingMinutes = Math.floor((now - waitingStartTime) / 60000);

                // Calcular bloque actual (0-9 min = bloque 0, 10-19 min = bloque 1, etc.)
                const currentBlock = Math.floor(waitingMinutes / 10);
                const previousBlock = order.waitingTimeBlocks || 0;

                // Enviar notificación cada minuto
                const lastNotification = order.waitingNotificationsSent?.[order.waitingNotificationsSent.length - 1] || 0;
                const minutesSinceLastNotification = Math.floor((now - lastNotification) / 60000);

                if (minutesSinceLastNotification >= 1 || !order.waitingNotificationsSent?.length) {
                    let notificationMessage = '';
                    let notificationTitle = 'Washer Waiting';

                    if (waitingMinutes < 10) {
                        // Primeros 10 minutos - advertencia
                        notificationMessage = `Your washer is waiting (${waitingMinutes} min). Please authorize the service. After 10 minutes, you will be charged $10 for every additional 10 minutes.`;
                    } else {
                        // Después de 10 minutos - mostrar cargo actual
                        const blocksCharged = currentBlock; // Bloque 1 = $10, Bloque 2 = $20, etc.
                        const currentCharge = blocksCharged * 10;
                        notificationMessage = `Your washer has been waiting ${waitingMinutes} minutes. Current waiting charge: $${currentCharge}. Please authorize the service now.`;
                        notificationTitle = '⚠️ Waiting Charges Apply';
                    }

                    // Enviar notificación push
                    if (order.clientId) {
                        try {
                            // Obtener FCM token del cliente
                            const clientDoc = await db.collection('users').doc(order.clientId).get();
                            const fcmToken = clientDoc.data()?.fcmToken;

                            if (fcmToken) {
                                await admin.messaging().send({
                                    token: fcmToken,
                                    notification: {
                                        title: notificationTitle,
                                        body: notificationMessage
                                    },
                                    data: {
                                        orderId: orderDoc.id,
                                        type: 'waiting_time',
                                        waitingMinutes: waitingMinutes.toString(),
                                        currentCharge: (currentBlock * 10).toString()
                                    },
                                    android: {
                                        priority: 'high',
                                        notification: {
                                            channelId: 'waiting_alerts',
                                            priority: 'high',
                                            sound: 'default'
                                        }
                                    }
                                });

                                console.log(`Sent notification to client ${order.clientId} for order ${orderDoc.id}`);
                            }
                        } catch (error) {
                            console.error(`Error sending notification for order ${orderDoc.id}:`, error);
                        }
                    }

                    // Actualizar timestamp de última notificación
                    await orderDoc.ref.update({
                        waitingNotificationsSent: admin.firestore.FieldValue.arrayUnion(now)
                    });
                }

                // Actualizar cargo si cambió de bloque
                if (currentBlock > previousBlock) {
                    const chargePerBlock = order.waitingChargePerBlock || 10;
                    const totalCharge = currentBlock * chargePerBlock;

                    await orderDoc.ref.update({
                        waitingTimeBlocks: currentBlock,
                        waitingCharge: totalCharge
                    });

                    console.log(`Updated order ${orderDoc.id}: Block ${currentBlock}, Charge $${totalCharge}`);
                }
            }

            return null;
        } catch (error) {
            console.error('Error in notifyWaitingTime function:', error);
            return null;
        }
    });
