// Test script to send push notifications manually
// Run with: node test-notification.js

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const messaging = admin.messaging();

async function sendTestNotification(userId) {
    try {
        // Get user's FCM token
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;

        if (!fcmToken) {
            console.log('❌ Usuario no tiene token FCM registrado');
            console.log('   Asegúrate de que el usuario haya iniciado sesión en la app');
            return;
        }

        console.log(`📱 Enviando notificación de prueba a: ${userData.name || userData.email}`);
        console.log(`   Token: ${fcmToken.substring(0, 20)}...`);

        // Send notification
        const message = {
            notification: {
                title: '🧪 Notificación de Prueba',
                body: 'Si ves esto, ¡las notificaciones funcionan correctamente!'
            },
            data: {
                type: 'test',
                timestamp: new Date().toISOString()
            },
            token: fcmToken
        };

        const response = await messaging.send(message);
        console.log('✅ Notificación enviada exitosamente:', response);

    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
    }
}

// Usage: Replace with actual user ID
const testUserId = process.argv[2];

if (!testUserId) {
    console.log('❌ Por favor proporciona un User ID');
    console.log('   Uso: node test-notification.js <userId>');
    process.exit(1);
}

sendTestNotification(testUserId)
    .then(() => {
        console.log('\n✅ Script completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
