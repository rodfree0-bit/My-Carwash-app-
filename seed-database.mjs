// Script para crear datos iniciales (seed) en Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
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

// Paquetes de servicio
const packages = [
    {
        id: 'basic-wash',
        name: 'Basic Wash',
        description: 'Exterior hand wash, tire shine, and quick interior vacuum',
        duration: '30 min',
        washerCommission: 40,
        price: {
            'Sedan': 25,
            'SUV': 35,
            'Truck': 40,
            'Van': 35,
            'Motorcycle': 15,
            'Luxury': 45
        },
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400'
    },
    {
        id: 'premium-wash',
        name: 'Premium Wash',
        description: 'Full exterior wash, wax, tire shine, complete interior vacuum and wipe down',
        duration: '60 min',
        washerCommission: 40,
        price: {
            'Sedan': 45,
            'SUV': 60,
            'Truck': 70,
            'Van': 60,
            'Motorcycle': 30,
            'Luxury': 80
        },
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400'
    },
    {
        id: 'deluxe-detail',
        name: 'Deluxe Detail',
        description: 'Complete detailing: exterior wash, clay bar, wax, polish, full interior deep clean, leather conditioning',
        duration: '120 min',
        washerCommission: 40,
        price: {
            'Sedan': 120,
            'SUV': 150,
            'Truck': 170,
            'Van': 150,
            'Motorcycle': 80,
            'Luxury': 200
        },
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400'
    }
];

// Add-ons
const addons = [
    {
        id: 'engine-clean',
        name: 'Engine Bay Cleaning',
        description: 'Deep clean and degrease engine compartment',
        duration: '20 min',
        price: {
            'Sedan': 25,
            'SUV': 30,
            'Truck': 35,
            'Van': 30,
            'Motorcycle': 15,
            'Luxury': 40
        }
    },
    {
        id: 'headlight-restore',
        name: 'Headlight Restoration',
        description: 'Remove oxidation and restore clarity to headlights',
        duration: '30 min',
        price: {
            'Sedan': 40,
            'SUV': 40,
            'Truck': 40,
            'Van': 40,
            'Motorcycle': 25,
            'Luxury': 50
        }
    },
    {
        id: 'pet-hair',
        name: 'Pet Hair Removal',
        description: 'Specialized deep cleaning to remove pet hair',
        duration: '30 min',
        price: {
            'Sedan': 30,
            'SUV': 40,
            'Truck': 45,
            'Van': 40,
            'Motorcycle': 0,
            'Luxury': 50
        }
    },
    {
        id: 'odor-removal',
        name: 'Odor Elimination',
        description: 'Ozone treatment to eliminate stubborn odors',
        duration: '45 min',
        price: {
            'Sedan': 50,
            'SUV': 60,
            'Truck': 65,
            'Van': 60,
            'Motorcycle': 30,
            'Luxury': 75
        }
    },
    {
        id: 'ceramic-coating',
        name: 'Ceramic Coating',
        description: 'Professional grade ceramic coating for long-lasting protection',
        duration: '180 min',
        price: {
            'Sedan': 300,
            'SUV': 400,
            'Truck': 450,
            'Van': 400,
            'Motorcycle': 200,
            'Luxury': 500
        }
    },
    {
        id: 'undercarriage-wash',
        name: 'Undercarriage Wash',
        description: 'Thorough cleaning of vehicle underside',
        duration: '15 min',
        price: {
            'Sedan': 20,
            'SUV': 25,
            'Truck': 30,
            'Van': 25,
            'Motorcycle': 10,
            'Luxury': 30
        }
    }
];

// Tipos de vehículos
const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', icon: 'directions_car' },
    { id: 'suv', name: 'SUV', icon: 'airport_shuttle' },
    { id: 'truck', name: 'Truck', icon: 'local_shipping' },
    { id: 'van', name: 'Van', icon: 'airport_shuttle' },
    { id: 'motorcycle', name: 'Motorcycle', icon: 'two_wheeler' },
    { id: 'luxury', name: 'Luxury', icon: 'sports_car' }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...\n');

        // Seed packages
        console.log('📦 Creating service packages...');
        for (const pkg of packages) {
            await setDoc(doc(db, 'packages', pkg.id), pkg);
            console.log(`  ✅ ${pkg.name}`);
        }

        // Seed addons
        console.log('\n🔧 Creating add-ons...');
        for (const addon of addons) {
            await setDoc(doc(db, 'addons', addon.id), addon);
            console.log(`  ✅ ${addon.name}`);
        }

        // Seed vehicle types
        console.log('\n🚗 Creating vehicle types...');
        for (const type of vehicleTypes) {
            await setDoc(doc(db, 'vehicleTypes', type.id), type);
            console.log(`  ✅ ${type.name}`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - ${packages.length} service packages`);
        console.log(`  - ${addons.length} add-ons`);
        console.log(`  - ${vehicleTypes.length} vehicle types`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }

    process.exit(0);
}

seedDatabase();
