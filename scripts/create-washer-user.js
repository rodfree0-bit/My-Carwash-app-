// Script para crear usuario washer en Firestore
// Ejecutar con: node scripts/create-washer-user.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Necesitas descargar esto de Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createWasherUser() {
    const userId = 'tDP9FSQUiaRfhZYopgYesWnL'; // UID del usuario de Firebase Auth
    const email = 'crami2015@gmail.com';

    const washerData = {
        id: userId,
        email: email,
        name: 'Carlos Rodrigo Montoya',
        role: 'washer',
        status: 'Active',
        phone: '+1 (555) 000-0000',
        address: 'Los Angeles, CA',
        joinedDate: new Date().toISOString(),
        completedJobs: 0,
        rating: 5.0,
        avatar: '',
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection('users').doc(userId).set(washerData, { merge: true });
        console.log('✅ Usuario washer creado exitosamente en Firestore');
        console.log('Email:', email);
        console.log('Rol:', washerData.role);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando usuario:', error);
        process.exit(1);
    }
}

createWasherUser();
