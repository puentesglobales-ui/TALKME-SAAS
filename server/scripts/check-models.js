require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function check() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No key");
        return;
    }
    const genAI = new GoogleGenerativeAI(key);

    const candidates = ["gemini-1.5-flash", "gemini-pro"];

    // Test v1beta (default)
    console.log("--- Testing v1beta ---");
    for (const m of candidates) {
        try {
            console.log(`Trying ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const res = await model.generateContent("Hi");
            console.log(`SUCCESS ${m}: ${res.response.text()}`);
            return;
        } catch (e) {
            console.log(`Failed ${m}: ${e.message.slice(0, 100)}...`);
        }
    }

    // Test v1
    console.log("\n--- Testing v1 ---");
    for (const m of candidates) {
        try {
            console.log(`Trying ${m}...`);
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
            const res = await model.generateContent("Hi");
            console.log(`SUCCESS ${m} (v1): ${res.response.text()}`);
            return;
        } catch (e) {
            console.log(`Failed ${m}: ${e.message.slice(0, 100)}...`);
        }
    }
}
check();
