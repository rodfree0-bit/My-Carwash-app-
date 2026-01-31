import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

/**
 * Cloud Function que se ejecuta cuando se crea un nuevo MENSAJE en el chat de una orden.
 * Crea un documento en la colección 'notifications' para el receptor.
 */
export const onMessageCreated = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
        const message = snap.data();
        const { senderId, receiverId, orderId, content, type } = message;

        console.log(`💬 New message in order ${orderId} from ${senderId} to ${receiverId}`);

        try {
            const db = admin.firestore();

            // Create in-app notification document
            // This will trigger 'onNotificationCreated' which sends the actual push
            await db.collection('notifications').add({
                userId: receiverId,
                title: 'New Message',
                message: type === 'image' ? 'Sent you an image' : content.length > 50 ? `${content.substring(0, 47)}...` : content,
                type: 'info',
                read: false,
                linkTo: 'CLIENT_HOME', // App handles routing based on role
                relatedId: orderId,
                timestamp: Date.now(),
                extraData: { orderId, type: 'new_message' }
            });

            console.log(`✅ Message notification document created for ${receiverId}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error creating message notification document:', error);
            return null;
        }
    });
