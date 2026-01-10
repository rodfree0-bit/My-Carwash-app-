// Script para enviar una notificación de prueba a tu dispositivo
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sendTestNotification() {
    try {
        // IMPORTANTE: Reemplaza 'TU_USER_ID' con tu ID de usuario real
        const userId = 'TU_USER_ID'; // Busca tu ID en Firestore → users

        console.log('📤 Enviando notificación de prueba...');

        // Crear una orden de prueba (esto activará la función Cloud)
        const testOrder = {
            clientId: userId,
            clientName: 'Test Client',
            status: 'New',
            vehicle: 'Test Car',
            vehicleType: 'Sedan',
            service: 'Basic Wash',
            price: 25,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            address: '123 Test Street',
            createdAt: Date.now()
        };

        const docRef = await addDoc(collection(db, 'orders'), testOrder);

        console.log('✅ Orden de prueba creada:', docRef.id);
        console.log('📬 La notificación debería llegar en unos segundos...');
        console.log('\n💡 Verifica:');
        console.log('1. Tu celular tiene el APK instalado');
        console.log('2. Iniciaste sesión');
        console.log('3. Aceptaste permisos de notificaciones');
        console.log('4. Tu usuario tiene fcmToken en Firestore');

    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

sendTestNotification();
