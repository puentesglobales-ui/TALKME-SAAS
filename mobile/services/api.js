import axios from 'axios';

// Mobile App always connects to Production for MVP
const BASE_URL = 'https://mvp-idiomas-server.onrender.com/api';
// const BASE_URL = 'http://192.168.0.6:3000/api'; // Local Debug

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getScenarios = async () => {
    try {
        const response = await api.get('/scenarios');
        return response.data;
    } catch (error) {
        console.error('API Error (Scenarios):', error);
        return [];
    }
};

export const sendMessage = async (messages, scenarioId, userId) => {
    try {
        const response = await api.post('/chat', { messages, scenarioId, userId });
        return response.data;
    } catch (error) {
        console.error('API Error (Chat):', error);
        throw error;
    }
};

// Audio upload will need 'expo-file-system' adaptation, 
// leaving simplified for text-first check
export const sendAudio = async (uri, scenarioId) => {
    // TODO: Implement FormData upload with Expo FileSystem
    console.log('Audio upload not yet implemented in Phase 1');
};

export default api;
