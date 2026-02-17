require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log('--- Gemini Diagnostic Tool v3 ---');
    if (!key) {
        console.error('❌ ERROR: GEMINI_API_KEY not found in .env');
        return;
    }
    const genAI = new GoogleGenerativeAI(key);
    const modelsToTry = ['gemini-1.5-flash', 'gemini-pro'];

    for (const mName of modelsToTry) {
        process.stdout.write(`Testing model: ${mName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: mName });
            const testRes = await model.generateContent('Respond OK');
            console.log(`✅ SUCCESS: ${testRes.response.text().trim()}`);
            return;
        } catch (err) {
            console.log(`❌ FAILED: ${err.message}`);
        }
    }
    console.log('\n💡 Pro-tip: If all fail with 404, your API Key might be from Google Cloud (GCP) instead of Google AI Studio.');
    console.log('Please go to https://aistudio.google.com/ and create a specific "Google AI Studio" API Key.');
}
testGemini();