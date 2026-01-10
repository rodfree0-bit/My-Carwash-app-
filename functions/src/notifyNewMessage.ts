import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Initialize Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

export const notifyNewMessage = functions.firestore
    .document('supportTickets/{ticketId}/messages/{messageId}')
    .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
        const messageData = snap.data();
        const { ticketId } = context.params;

        // Only notify for client or washer messages (ignore admin's own responses)
        if (messageData.senderRole === 'admin' || messageData.senderId === 'system') {
            return null;
        }

        try {
            // Get the ticket to find out who the user is (if name missing in message)
            const ticketSnap = await admin.firestore().collection('supportTickets').doc(ticketId).get();
            const ticketData = ticketSnap.data();
            const ticketUserName = ticketData?.userName || 'User';
            const ticketSource = ticketData?.source || '';

            const senderName = messageData.senderName || ticketUserName;
            let messageBody = messageData.message || 'Sent an attachment';

            // Append source to message body if available for context
            if (ticketSource) {
                messageBody = `[${ticketSource}] ${messageBody}`;
            }

            // Find all admin users to notify
            // We look for users with role 'admin' who have an fcmToken
            const adminsQuery = await admin.firestore()
                .collection('users')
                .where('role', '==', 'admin')
                .get();

            const tokens: string[] = [];
            adminsQuery.forEach(doc => {
                const userData = doc.data();
                if (userData.fcmToken) {
                    tokens.push(userData.fcmToken);
                }
            });

            if (tokens.length === 0) {
                console.log('No admin tokens found to notify.');
                return null;
            }

            // Create notification payload
            const payload: admin.messaging.MulticastMessage = {
                tokens: tokens, // Multicast handles up to 500 tokens
                notification: {
                    title: `New Message from ${senderName}`,
                    body: messageBody,
                },
                data: {
                    type: 'SUPPORT_MESSAGE',
                    ticketId: ticketId,
                    click_action: 'FLUTTER_NOTIFICATION_CLICK' // Standard for many libs, or handled by app
                },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'default', // Make sure app channel matches or is 'default'
                        priority: 'high',
                        sound: 'default'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                            contentAvailable: true
                        }
                    }
                }
            };

            // Send notifications
            const response = await admin.messaging().sendEachForMulticast(payload);

            console.log(`Notifications sent: ${response.successCount} success, ${response.failureCount} failed.`);

            // Cleanup invalid tokens if necessary (optional improvement)
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
                    }
                });
            }

            return { success: true, sentCount: response.successCount };

        } catch (error) {
            console.error('Error sending support notification:', error);
            return null;
        }
    });
