const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkOrders() {
    console.log('--- Ultimas 5 Ordenes ---');
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(5).get();
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`Status: ${data.status}`);
        console.log(`WasherID: ${data.washerId || 'None'}`);
        console.log(`WasherName: ${data.washerName || 'None'}`);
        console.log(`CreatedAt: ${data.createdAt?.toDate?.() || data.createdAt}`);
        console.log('---------------------------');
    });
    process.exit(0);
}

checkOrders();
