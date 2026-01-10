const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// Test function to verify deployment works
exports.testFunction = functions.https.onRequest((req, res) => {
    res.send("Cloud Functions are working!");
});

// Scheduled function for waiting time notifications
exports.notifyWaitingTime = functions.pubsub
    .schedule('every 1 minutes')
    .timeZone('America/Los_Angeles')
    .onRun(async (context) => {
        const db = admin.firestore();
        const now = Date.now();

        try {
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
                const currentBlock = Math.floor(waitingMinutes / 10);
                const previousBlock = order.waitingTimeBlocks || 0;

                const waitingNotificationsSent = order.waitingNotificationsSent || [];
                const lastNotification = waitingNotificationsSent.length > 0 ? waitingNotificationsSent[waitingNotificationsSent.length - 1] : 0;
                const minutesSinceLastNotification = Math.floor((now - lastNotification) / 60000);

                if (minutesSinceLastNotification >= 1 || waitingNotificationsSent.length === 0) {
                    let notificationMessage = '';
                    let notificationTitle = 'Washer Waiting';

                    if (waitingMinutes < 10) {
                        notificationMessage = `Your washer is waiting (${waitingMinutes} min). Please authorize the service. After 10 minutes, you will be charged $10 for every additional 10 minutes.`;
                    } else {
                        const blocksCharged = currentBlock;
                        const currentCharge = blocksCharged * 10;
                        notificationMessage = `Your washer has been waiting ${waitingMinutes} minutes. Current waiting charge: $${currentCharge}. Please authorize the service now.`;
                        notificationTitle = '⚠️ Waiting Charges Apply';
                    }

                    if (order.clientId) {
                        try {
                            const clientDoc = await db.collection('users').doc(order.clientId).get();
                            const clientData = clientDoc.data();
                            const fcmToken = clientData ? clientData.fcmToken : null;

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

                    await orderDoc.ref.update({
                        waitingNotificationsSent: admin.firestore.FieldValue.arrayUnion(now)
                    });
                }

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
