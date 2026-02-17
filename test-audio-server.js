const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// UPDATE THIS with your real server URL if different
const SERVER_URL = 'https://mvp-idiomas-server.onrender.com';
const API_ENDPOINT = `${SERVER_URL}/api/speak`;

// Create a dummy audio file for testing
const testAudioPath = path.join(__dirname, 'test_audio.txt');
fs.writeFileSync(testAudioPath, 'dummy audio content');

async function testServer() {
    console.log(`🚀 Testing connection to: ${SERVER_URL}`);

    // 1. Health Check
    try {
        const health = await axios.get(`${SERVER_URL}/api/health`);
        console.log('✅ Health Check Passed:', health.data);
    } catch (e) {
        console.error('❌ Health Check Failed:', e.message);
        return;
    }

    // 2. Audio Upload Test (Simulated)
    console.log('\n🎙️ Testing /api/speak endpoint...');

    const formData = new FormData();
    // Simulate a webm file upload
    formData.append('audio', fs.createReadStream(testAudioPath), 'test_input.webm');
    formData.append('userId', 'test-diagnostico');
    formData.append('scenarioId', 'scn_coffee');

    try {
        const response = await axios.post(API_ENDPOINT, formData, {
            headers: {
                ...formData.getHeaders()
            },
            validateStatus: () => true // Don't throw on error status
        });

        if (response.status === 200) {
            console.log('✅ SUCCESS! Audio processed correctly.');
            console.log('Response:', response.data);
        } else {
            console.log(`❌ SERVER ERROR: ${response.status}`);
            console.log('Error Details:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('💥 Network/Client Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    } finally {
        fs.unlinkSync(testAudioPath);
    }
}

testServer();
