/**
 * Script para borrar todas las órdenes de Firestore
 * 
 * INSTRUCCIONES:
 * 1. Abre la consola de Firebase: https://console.firebase.google.com
 * 2. Ve a tu proyecto
 * 3. Abre la consola del navegador (F12)
 * 4. Copia y pega este script completo
 * 5. Presiona Enter
 */

import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function deleteAllOrders() {
    console.log('🗑️  Iniciando eliminación de todas las órdenes...');

    try {
        const ordersRef = collection(db, 'orders');
        const snapshot = await getDocs(ordersRef);

        if (snapshot.empty) {
            console.log('✅ No hay órdenes. La colección ya está vacía.');
            return;
        }

        console.log(`📊 Se encontraron ${snapshot.size} órdenes para eliminar.`);

        let deletedCount = 0;
        const deletePromises = [];

        snapshot.forEach((orderDoc) => {
            deletePromises.push(
                deleteDoc(doc(db, 'orders', orderDoc.id))
                    .then(() => {
                        deletedCount++;
                        if (deletedCount % 10 === 0) {
                            console.log(`🔥 Eliminadas ${deletedCount}/${snapshot.size} órdenes...`);
                        }
                    })
            );
        });

        await Promise.all(deletePromises);

        console.log(`✅ ¡Se eliminaron exitosamente ${deletedCount} órdenes!`);
        alert(`✅ Se eliminaron ${deletedCount} órdenes del historial.`);

    } catch (error) {
        console.error('❌ Error al eliminar órdenes:', error);
        alert('❌ Error: ' + error.message);
    }
}

// Ejecutar la función
deleteAllOrders();
