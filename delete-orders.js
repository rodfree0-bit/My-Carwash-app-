const admin = require('firebase-admin');

// Inicializar la app (asume que ya hay credenciales o está en entorno seguro)
// Si se ejecuta localmente con `firebase functions:shell`, esto funciona.
// Si es standalone, necesitaríamos credenciales, pero usaremos el shell por simplicidad.
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();

async function deleteAllOrders() {
    console.log("⚠️ INICIANDO BORRADO TOTAL DE ÓRDENES...");

    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
        console.log("✅ No hay órdenes para borrar.");
        return;
    }

    console.log(`🔍 Se encontraron ${snapshot.size} órdenes para eliminar.`);

    const batchSize = 500;
    let batch = db.batch();
    let count = 0;
    let totalDeleted = 0;

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        count++;

        if (count >= batchSize) {
            await batch.commit();
            totalDeleted += count;
            console.log(`🗑️ Eliminadas ${totalDeleted} órdenes...`);
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
        totalDeleted += count;
    }

    console.log(`✅ BORRADO COMPLETADO: Se eliminaron un total de ${totalDeleted} órdenes.`);
}

// Ejecutar la función
deleteAllOrders().then(() => {
    console.log("🏁 Proceso finalizado.");
    process.exit(0);
}).catch((error) => {
    console.error("❌ Error al borrar órdenes:", error);
    process.exit(1);
});
