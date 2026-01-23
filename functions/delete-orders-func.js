const { onCall } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

exports.deleteAllOrdersManual = onCall(async (request) => {
    console.log("⚠️ INICIANDO BORRADO TOTAL DE ÓRDENES (Cloud Function)...");

    const db = getFirestore();
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
        return { message: "✅ No hay órdenes para borrar." };
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
    return {
        success: true,
        deletedCount: totalDeleted,
        message: `Se eliminaron ${totalDeleted} órdenes exitosamente.`
    };
});
