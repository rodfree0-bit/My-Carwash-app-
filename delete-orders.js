// Script to delete all orders from Firestore
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteAllOrders() {
    console.log('🗑️  Starting to delete all orders...');

    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
        console.log('✅ No orders found. Collection is already empty.');
        return;
    }

    console.log(`📊 Found ${snapshot.size} orders to delete.`);

    // Delete in batches of 500 (Firestore limit)
    const batchSize = 500;
    let deletedCount = 0;

    while (true) {
        const batch = db.batch();
        const docs = await ordersRef.limit(batchSize).get();

        if (docs.empty) {
            break;
        }

        docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        deletedCount += docs.size;
        console.log(`🔥 Deleted ${deletedCount} orders so far...`);

        if (docs.size < batchSize) {
            break;
        }
    }

    console.log(`✅ Successfully deleted ${deletedCount} orders!`);
    process.exit(0);
}

deleteAllOrders().catch(error => {
    console.error('❌ Error deleting orders:', error);
    process.exit(1);
});
