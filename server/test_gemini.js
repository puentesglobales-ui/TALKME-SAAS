const axios = require('axios');
const key = 'AIzaSyBmMz50s-MqC9UhEHnwXILWAAFR5tG0Cq4';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

axios.post(url, {
    contents: [{ parts: [{ text: 'hi' }] }]
}).then(res => {
    console.log('SUCCESS:', JSON.stringify(res.data, null, 2));
}).catch(err => {
    console.error('ERROR:', err.response ? err.response.data : err.message);
});
