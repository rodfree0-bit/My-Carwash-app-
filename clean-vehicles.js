// Emergency script to clean corrupted vehicle data
// Run this in browser console while logged in to localhost:5173

const cleanUserVehicles = async () => {
    const userId = 'qAQ80l1oVeNsZxHaabTi33DCMlB3'; // Your user ID

    const { doc, updateDoc, getFirestore } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    try {
        console.log('🧹 Cleaning corrupted vehicle data...');

        // Clear the savedVehicles array completely
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            savedVehicles: [] // Reset to empty array
        });

        console.log('✅ Vehicle data cleaned! Refresh the page.');
        alert('Vehicle data cleaned! Please refresh the page (F5)');
    } catch (error) {
        console.error('❌ Error cleaning data:', error);
    }
};

// Run it
cleanUserVehicles();
