
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (uses default credentials if available, or we might need service account)
// Since we are in the environment where we can deploy functions, we likely have credentials.
// Or we can try to use the existing `functions/index.js` setup logic but simplified.

const admin = require("firebase-admin");
try {
    admin.initializeApp();
} catch (e) {
    // ignore if already initialized
}

async function seedTip() {
    const db = admin.firestore();
    console.log("🌱 Seeding SEO Tip...");

    const tip = {
        title: "The Importance of Regular Waxing",
        content: "Protect your car's paint from the harsh Los Angeles sun! Regular waxing creates a barrier against UV rays, bird droppings, and industrial fallout.\n\nWe recommend a high-quality carnauba wax every 3 months to maintain that showroom shine and protect your investment.",
        keywords: ["waxing", "paint protection", "UV protection", "mobile car wash Los Angeles"],
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('seo_content').doc('daily_tip').set(tip);
    console.log("✅ Tip seeded successfully!");
}

seedTip().catch(console.error);
