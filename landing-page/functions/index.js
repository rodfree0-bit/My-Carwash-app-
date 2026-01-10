const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();

// ============================================
// SCHEDULED FUNCTION: Daily SEO Content Update
// ============================================
exports.scheduledSeoUpdate = onSchedule("0 0 * * *", async (event) => {
    // API key - using the correct one provided by user
    const apiKey = "AIzaSyDw3HEMVENhkMGiJdA_HtEbaFNrNSYsl0";

    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found");
        return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        You are an expert SEO content writer for a premium mobile car wash and detailing service in Los Angeles.
        
        Generate a helpful, professional car care tip that will:
        - Help car owners maintain their vehicles
        - Include relevant keywords for local SEO (mobile car wash, car detailing, Los Angeles, etc.)
        - Be concise and actionable (2-3 short paragraphs)
        - Focus on topics like: paint protection, interior cleaning, seasonal care, maintenance tips
        
        IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
        {
            "title": "A catchy and SEO-optimized title",
            "content": "The expert advice in 2-3 short paragraphs",
            "keywords": ["keyword1", "keyword2", "keyword3"]
        }
    `;

    try {
        console.log("🤖 Requesting new SEO content from Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonContent = JSON.parse(cleanedText);

        const db = getFirestore();
        await db.collection('seo_content').doc('daily_tip').set({
            ...jsonContent,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("✅ Daily SEO tip updated successfully in Firestore");
    } catch (error) {
        console.error("❌ Error generating or saving SEO tip:", error);
    }

    return null;
});
