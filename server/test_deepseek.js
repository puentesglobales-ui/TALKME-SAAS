const axios = require('axios');
const key = 'sk-7e8993d15f5a4f86b3c1625e27b69fc3';
const url = 'https://api.deepseek.com/chat/completions';

axios.post(url, {
    model: "deepseek-chat",
    messages: [{ role: "user", content: "hi" }]
}, {
    headers: { 'Authorization': `Bearer ${key}` }
}).then(res => {
    console.log('SUCCESS:', JSON.stringify(res.data, null, 2));
}).catch(err => {
    console.error('ERROR:', err.response ? err.response.data : err.message);
});
