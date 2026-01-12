
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize with default credentials
if (admin.apps.length === 0) {
    admin.initializeApp();
}

async function seedTip() {
    const db = getFirestore();
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
