import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

/**
 * Cloud Function that triggers when a new document is added to the 'notifications' collection.
 * It sends a real Push Notification (FCM) to the target user(s).
 */
export const onNotificationCreated = functions.firestore.onDocumentCreated('notifications/{notificationId}', async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const { userId, title, message, type, relatedId } = data;

    console.log(`🔔 Processing notification for user: ${userId} (${type})`);

    try {
        const db = admin.firestore();
        const fcm = admin.messaging();

        let tokens: string[] = [];

        // CASE 1: BROADCAST TO ALL WASHERS
        if (userId === 'washer-broadcast') {
            console.log('📢 Broadcasting notification to all active washers...');
            const washersSnapshot = await db.collection('users')
                .where('role', '==', 'washer')
                .where('status', '==', 'Active')
                .get();

            washersSnapshot.forEach(doc => {
                const token = doc.data().fcmToken;
                if (token) tokens.push(token);
            });
        }
        // CASE 2: BROADCAST TO ALL ADMINS
        else if (userId === 'admin-broadcast') {
            const adminsSnapshot = await db.collection('users')
                .where('role', '==', 'admin')
                .get();

            adminsSnapshot.forEach(doc => {
                const token = doc.data().fcmToken;
                if (token) tokens.push(token);
            });
        }
        // CASE 3: TARGETED USER
        else {
            const userDoc = await db.collection('users').doc(userId).get();
            const token = userDoc.data()?.fcmToken;
            if (token) tokens.push(token);
        }

        if (tokens.length === 0) {
            console.log('⚠️ No target tokens found for this notification.');
            return;
        }

        // Prepare FCM Payload
        const payload: admin.messaging.MulticastMessage = {
            tokens: tokens.slice(0, 500), // Max tokens per batch
            notification: {
                title: title || 'My Carwash Alert',
                body: message || 'You have a new update.',
            },
            data: {
                type: type || 'general',
                relatedId: relatedId || '',
                click_action: 'FLUTTER_NOTIFICATION_CLICK' // For general compatibility
            },
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'general',
                    priority: 'high'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1
                    }
                }
            }
        };

        const response = await fcm.sendEachForMulticast(payload);
        console.log(`✅ Successfully sent ${response.successCount} push notifications.`);

        if (response.failureCount > 0) {
            console.warn(`❌ Failed to send ${response.failureCount} notifications.`);
        }

    } catch (error) {
        console.error('❌ Error in onNotificationCreated:', error);
    }
});
