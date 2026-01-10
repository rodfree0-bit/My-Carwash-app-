import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Try to load serviceAccountKey, handle if missing
let serviceAccount;
try {
    serviceAccount = require('../../serviceAccountKey.json');
} catch (e) {
    console.log("No serviceAccountKey.json found, checking if default creds work...");
}

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        admin.initializeApp(); // Fallback to GOOGLE_APPLICATION_CREDENTIALS or emulator
    }
}

const db = admin.firestore();

async function findUser(name) {
    console.log(`Searching for user with name: ${name}`);
    try {
        const snapshot = await db.collection('users').get();

        if (snapshot.empty) {
            console.log('No users found in collection.');
            return;
        }

        let found = false;
        snapshot.forEach(doc => {
            const data = doc.data();
            // Check name or email
            const target = name.toLowerCase();
            if ((data.name && data.name.toLowerCase().includes(target)) ||
                (data.email && data.email.toLowerCase().includes(target))) {
                console.log(`FOUND_USER: ${doc.id} | Name: ${data.name} | Email: ${data.email}`);
                found = true;
            }
        });

        if (!found) console.log(`No user found matching "${name}"`);

    } catch (error) {
        console.error("Error accessing Firestore:", error.message);
        if (error.code === 'app/no-app') {
            console.error("Firebase Admin not initialized correctly. Ensure serviceAccountKey.json exists or env vars are set.");
        }
    }
}

const nameArg = process.argv[2] || 'Carlos';
findUser(nameArg);
