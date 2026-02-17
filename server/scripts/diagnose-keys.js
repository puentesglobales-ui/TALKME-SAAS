require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function diagnose() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ ERROR: No GEMINI_API_KEY found in .env");
        return;
    }

    console.log(`🔑 Key found: ...${key.slice(-4)}`);

    // Check module location
    try {
        console.log(`📦 Module Path: ${require.resolve('@google/generative-ai')}`);
        const pkg = require('@google/generative-ai/package.json');
        console.log(`📦 SDK Version: ${pkg.version}`);
    } catch (e) {
        console.log(`📦 SDK Info unavailable: ${e.message}`);
    }

    const genAI = new GoogleGenerativeAI(key);

    // Try listModels if available
    if (typeof genAI.listModels === 'function') {
        try {
            console.log("\n📡 Checking models (listModels)...");
            const list = await genAI.listModels();
            console.log("✅ listModels success!");
            const models = list.models.map(m => m.name.replace('models/', ''));
            console.log(`📋 Models: ${models.join(', ')}`);
        } catch (e) {
            console.error(`❌ listModels failed: ${e.message}`);
        }
    } else {
        console.log("\n⚠️ genAI.listModels is NOT a function (SDK might be old or weird), skipping list...");
    }

    // Always try generation directly
    console.log("\n⚡ Testing generateContent with 'gemini-1.5-flash'...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say Hello");
        console.log(`🎉 SUCCESS: ${result.response.text().trim()}`);
    } catch (err) {
        console.error(`❌ Generation Failed: ${err.message}`);
        if (err.message.includes('404')) console.log("   -> Model not found (Check Key permissions/Project).");
    }
}

diagnose();

// Multiple Models check
const models = ['gemini-1.5-flash', 'gemini-pro'];
(async () => { for(const m of models) { console.log(Testing ...); try { const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: m }); const res = await model.generateContent('Hello'); console.log( OK: ); } catch(e) { console.log( FAIL : ); } } })();
