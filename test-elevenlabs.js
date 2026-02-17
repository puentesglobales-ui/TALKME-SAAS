const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: 'server/.env' });

async function testElevenLabs() {
    const API_KEY = process.env.ELEVENLABS_API_KEY;
    console.log(`🔑 Testing ElevenLabs Key: ${API_KEY ? API_KEY.substring(0, 5) + '...' : 'MISSING'}`);

    if (!API_KEY) {
        console.error('❌ No API Key found in server/.env');
        return;
    }

    try {
        const response = await axios.get('https://api.elevenlabs.io/v1/user', {
            headers: {
                'xi-api-key': API_KEY.trim()
            }
        });

        console.log('✅ Success! User details:');
        console.log(`   Name: ${response.data.subscription.tier}`);
        console.log(`   Character Count: ${response.data.subscription.character_count}/${response.data.subscription.character_limit}`);

    } catch (error) {
        console.error('❌ Failed to authenticate with ElevenLabs:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testElevenLabs();
