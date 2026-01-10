import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
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

async function deleteAllSystemNotifications() {
    try {
        console.log('🔍 Buscando TODAS las notificaciones...');

        const notificationsRef = collection(db, 'notifications');
        const querySnapshot = await getDocs(notificationsRef);

        console.log(`📋 Total de notificaciones encontradas: ${querySnapshot.size}`);

        let deletedCount = 0;

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const title = (data.title || '').toLowerCase();
            const message = (data.message || '').toLowerCase();

            // Buscar cualquier notificación que contenga estas palabras
            if (title.includes('system') || title.includes('update') || title.includes('v2.1') ||
                title.includes('admin fix') || message.includes('system') || message.includes('update') ||
                message.includes('v2.1') || message.includes('admin fix')) {

                console.log(`🗑️ Eliminando: "${data.title}" - "${data.message}"`);
                await deleteDoc(doc.ref);
                deletedCount++;
                console.log(`✅ Eliminada: ${doc.id}`);
            }
        }

        if (deletedCount === 0) {
            console.log('❌ No se encontraron notificaciones con esos términos');
            console.log('\n📋 Mostrando todas las notificaciones:');
            querySnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`- ID: ${doc.id}`);
                console.log(`  Título: ${data.title}`);
                console.log(`  Mensaje: ${data.message}`);
                console.log(`  Usuario: ${data.userId}`);
                console.log('---');
            });
        } else {
            console.log(`\n🎉 ${deletedCount} notificaciones eliminadas exitosamente`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

deleteAllSystemNotifications();
