import axios from 'axios';

const getBaseUrl = () => {
    // FORCE HARDCODED URL FOR PRODUCTION TO AVOID ENV VAR ISSUES
    if (import.meta.env.PROD) {
        return 'https://mvp-idiomas-server.onrender.com/api';
    }

    // Localhost fallback
    return 'http://localhost:3000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Get available scenarios
export const getScenarios = async () => {
    const response = await api.get('/scenarios');
    return response.data;
};

export const sendMessage = async (messages, scenarioId, userId) => {
    const response = await api.post('/chat', { messages, scenarioId, userId });
    return response.data;
};

export const sendAudio = async (audioBlob, scenarioId, userId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'input.webm');
    if (scenarioId) {
        formData.append('scenarioId', scenarioId);
    }
    if (userId) {
        formData.append('userId', userId);
    }

    // Let Axios/Browser set the correct multipart content-type with boundary
    const response = await api.post('/speak', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export default api;
