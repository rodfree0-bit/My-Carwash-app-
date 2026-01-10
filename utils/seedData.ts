import { db } from '../firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { DEFAULT_VEHICLE_TYPES } from '../data/vehicleTypes';
import { DEFAULT_SERVICE_PACKAGES } from '../data/servicePackages';

export const seedVehicleTypes = async () => {
    try {
        const batch = writeBatch(db);

        DEFAULT_VEHICLE_TYPES.forEach((vehicleType) => {
            const ref = doc(db, 'vehicle_types', vehicleType.id);
            batch.set(ref, vehicleType);
        });

        await batch.commit();
        console.log('✅ Vehicle types seeded successfully');
        return true;
    } catch (error) {
        console.error('❌ Error seeding vehicle types:', error);
        return false;
    }
};

export const seedServicePackages = async () => {
    try {
        const batch = writeBatch(db);

        DEFAULT_SERVICE_PACKAGES.forEach((pkg) => {
            const ref = doc(db, 'packages', pkg.id);
            batch.set(ref, pkg);
        });

        await batch.commit();
        console.log('✅ Service packages seeded successfully');
        return true;
    } catch (error) {
        console.error('❌ Error seeding service packages:', error);
        return false;
    }
};
