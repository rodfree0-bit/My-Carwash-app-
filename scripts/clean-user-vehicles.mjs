// Clean corrupted vehicle data from Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDWZFNSJdMBvIKDQNJkpDcCLdJKFWqRgRg",
    authDomain: "my-carwashapp-e6aba.firebaseapp.com",
    projectId: "my-carwashapp-e6aba",
    storageBucket: "my-carwashapp-e6aba.firebasestorage.app",
    messagingSenderId: "1066088088663",
    appId: "1:1066088088663:web:d3f2d0f8e8e4e8e4e8e8e8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanUserVehicles() {
    const userId = 'qAQ80l1oVeNsZxHaabTi33DCMlB3';

    try {
        console.log('🔍 Checking current user data...');
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('📋 Current savedVehicles:', JSON.stringify(userData.savedVehicles, null, 2));

            console.log('🧹 Cleaning corrupted vehicle data...');
            await updateDoc(userRef, {
                savedVehicles: []
            });

            console.log('✅ Vehicle data cleaned successfully!');
            console.log('✅ You can now add vehicles without errors.');
            console.log('✅ Refresh your browser at localhost:5173');
        } else {
            console.log('❌ User not found');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

cleanUserVehicles();
