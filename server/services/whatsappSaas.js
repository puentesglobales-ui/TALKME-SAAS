const express = require('express');
const router = express.Router();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const fs = require('fs');
const OpenAI = require('openai');
const copperService = require('./copperService'); // Import Copper CRM
const { generateResponse, generateAudio } = require('./aiRouter');


// Environment / Constants
const sessionsDir = 'sessions';
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir);
}

// Store active sockets and configs
const activeSessions = new Map();
const clientConfigs = new Map(); // Store { companyName, businessType, connectionType, mode }

const BUSINESS_TEMPLATES = {
    pizzeria: (name) => `Eres Luigi 👨‍🍳, el asistente virtual de la Pizzería ${name}.
    OBJETIVO: Tomar pedidos y vender.
    MENÚ:
    - Muzzarella: $10
    - Pepperoni: $12
    - Especial: $15
    REGLAS:
    1. Pregunta siempre: "¿Para retirar o envío?".
    2. Si es envío, pide la dirección.
    3. Sé divertido, usa muchos emojis 🍕🍅.
    4. Confirma el total al final.`,

    dentista: (name) => `Eres Sofia 👩‍⚕️, la secretaria del Consultorio Dental ${name}.
    OBJETIVO: Agendar citas y responder dudas.
    SERVICIOS:
    - Limpieza: $30
    - Blanqueamiento: $100
    - Consulta General: $20
    REGLAS:
    1. Horario: Lunes a Viernes de 9hs a 18hs.
    2. Para agendar, pide Nombre y DNI.
    3. Sé extremandamente formal, amable y profesional 🦷.`,

    generic: (name) => `
    ## 🎭 SYSTEM PROMPT: ALEX WHATSAPP v1.0 (Lead Gen)
    
    **CONTEXTO:** Actúa como Alex, el asistente virtual de ${name}. 
    **OBJETIVO PRINCIPAL:** Convertir al usuario en un lead calificado y **AGENDAR UNA LLAMADA** de 15 minutos para asesoría.

    ### 1. ALGORITMO DE DETECCIÓN (L-SCAN)
    Analiza el interés del usuario. Si detectas alta intención, salta directo al cierre (la llamada).

    ### 2. PROTOCOLO DE CONVERSIÓN (CORE ENGINE)
    1. **Empatía:** Valida siempre lo que el usuario dice.
    2. **Valor:** Explica brevemente cómo ${name} resuelve su problema.
    3. **Semilla de Cierre:** Termina siempre ofreciendo la llamada: "¿Te parece si agendamos una breve llamada mañana para explicarte los detalles?"

    ### 3. REGLAS DE ORO
    * Sé breve (máximo 2 oraciones por mensaje).
    * Usa un tono profesional pero cercano.
    * Si el usuario acepta la llamada, pide su EMAIL y una HORA preferida.`
};

// --- 🤖 AI LOGIC (SHARED) ---
async function generateAIResponse(text, config) {
    const { companyName, businessType, customPrompt } = config;
    try {
        let systemPrompt;
        if (businessType === 'custom' && customPrompt) {
            systemPrompt = customPrompt;
        } else {
            const templateFn = BUSINESS_TEMPLATES[businessType] || BUSINESS_TEMPLATES.generic;
            systemPrompt = templateFn(companyName);
        }

        // Usamos el router unificado (Gemini Hunter + Backups)
        const reply = await generateResponse(text, systemPrompt, []);
        return reply;
    } catch (err) {
        console.error('❌ WhatsApp AI Error:', err.message);
        return "Lo siento, tuve un problema procesando tu mensaje.";
    }
}

// --- 📲 QR HANDLER (NO CRM) ---
async function handleQRMessage(sock, msg, instanceId) {
    if (!msg.message) return;
    if (msg.key.remoteJid === 'status@broadcast') return;
    if (msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    // Get Config
    const config = clientConfigs.get(instanceId) || { companyName: 'Nuestro Negocio', businessType: 'generic' };
    const { companyName } = config;

    const remoteJid = msg.key.remoteJid;
    console.log(`📩 [QR: ${companyName}] Msg: ${text}`);

    try {
        await new Promise(r => setTimeout(r, 1000));
        await sock.readMessages([msg.key]);
        await sock.sendPresenceUpdate('composing', remoteJid);

        const reply = await generateAIResponse(text, config);

        if (config.mode === 'voice') {
            const audioBase64 = await generateAudio(reply);
            if (audioBase64) {
                await sock.sendMessage(remoteJid, {
                    audio: Buffer.from(audioBase64, 'base64'),
                    mimetype: 'audio/mp4',
                    ptt: true
                });
            } else {
                await sock.sendMessage(remoteJid, { text: reply });
            }
        } else {
            await sock.sendMessage(remoteJid, { text: reply });
        }
        console.log(`📤 Bot Replied: ${reply} (${config.mode})`);

    } catch (err) {
        console.error('❌ QR Handler Error:', err.message);
    }
}

// --- ☁️ CLOUD API HANDLER (WITH CRM) ---
async function handleCloudMessage(message) {
    const from = message.from;
    const text = message.text?.body;
    const name = message.contacts?.[0]?.profile?.name || 'Usuario';

    // For MVP, we assume a single 'API' config for the main number. 
    // In full multi-tenant, we'd look up config by phoneNumberId.
    const config = {
        companyName: 'Empresa Principal',
        businessType: 'generic',
        connectionType: 'API',
        mode: 'text', // Default
        crmEnabled: true
    };

    console.log(`📩 [API: ${from}] Msg: ${text}`);

    // 1. CRM Sync (API Only)
    if (config.crmEnabled) {
        // Run in background
        copperService.syncUser(from, name, null).catch(err => console.error('CRM Sync Fail:', err));
    }

    // 2. Generate Reply
    const reply = await generateAIResponse(text, config);

    // 3. Send Reply (Using Cloud API)
    try {
        const axios = require('axios');
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

        if (config.mode === 'voice') {
            console.log("🎙️ [Cloud API] Modo voz detectado, generando audio...");
            const audioBase64 = await generateAudio(reply);
            if (audioBase64) {
                // Para enviar audio por Cloud API se requiere subir el media primero o enviar un link.
                // Por simplicidad en MVP, si falla el audio enviamos texto.
                await axios.post(
                    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        type: 'text',
                        text: { body: reply + " (Voz no disponible en Cloud API MVP)" }
                    },
                    { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
                );
            } else {
                await axios.post(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, { messaging_product: 'whatsapp', to: from, type: 'text', text: { body: reply } }, { headers: { 'Authorization': `Bearer ${accessToken}` } });
            }
        } else {
            await axios.post(
                `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    type: 'text',
                    text: { body: reply }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
        console.log(`📤 Cloud API Replied: ${reply}`);
    } catch (error) {
        console.error('❌ Cloud API Send Error:', error.response?.data || error.message);
    }
}


// --- 🔗 CONNECT FUNCTION (Baileys) ---
async function connectToWhatsApp(instanceId, config, res = null) {
    const sessionPath = `${sessionsDir}/${instanceId}`;
    clientConfigs.set(instanceId, config);
    const { companyName } = config;

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'fatal' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        syncFullHistory: false,
        retryRequestDelayMs: 250
    });

    activeSessions.set(instanceId, sock);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && res && !res.headersSent) {
            QRCode.toDataURL(qr, (err, url) => {
                if (!err) {
                    res.json({
                        success: true,
                        instance_id: instanceId,
                        qr_code: url,
                        message: 'Escanear QR para conectar (Modo Celular)'
                    });
                }
            });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp(instanceId, config, null), 2000);
            } else {
                activeSessions.delete(instanceId);
                clientConfigs.delete(instanceId);
                try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch (e) { }
            }
        } else if (connection === 'open') {
            const type = config.connectionType || 'QR';
            console.log(`✅ ${companyName} (${type}) ONLINE!`);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (const msg of messages) {
                await handleQRMessage(sock, msg, instanceId);
            }
        }
    });

    return sock;
}

// --- 🔗 SAAS CONNECT ENDPOINT ---
router.post('/connect', async (req, res) => {
    const { companyName, businessType, connectionType, mode, customPrompt, voiceId } = req.body;

    // Defaults
    const bType = businessType || 'generic'; // pizzeria, dentista, custom
    const cType = connectionType || 'QR'; // API, QR
    const botMode = mode || 'text'; // text, voice

    console.log(`🔌 New Client Request: ${companyName} [${bType}] Type: ${cType} Mode: ${botMode}`);

    const config = {
        companyName,
        businessType: bType,
        connectionType: cType,
        mode: botMode,
        customPrompt,
        voiceId
    };

    if (cType === 'QR') {
        const safeName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const instanceId = `saas_${safeName}_${Date.now()}`;

        try {
            await connectToWhatsApp(instanceId, config, res);
            setTimeout(() => {
                if (!res.headersSent) res.status(408).json({ error: 'Timeout waiting for QR.' });
            }, 15000);
        } catch (err) {
            if (!res.headersSent) res.status(500).json({ error: err.message });
        }
    } else {
        // API Mode Setup
        res.json({
            success: true,
            connection_type: 'API',
            message: 'Configuración API Guardada. Usa los Webhooks de Meta con nuestra URL.',
            webhook_url: 'https://crmwhatsapp-xari.onrender.com/api/saas/webhook'
        });
        // In a real app, we would save this config to DB linked to phoneNumberId
    }
});

// --- 🌩️ CLOUD API WEBHOOKS ---
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Accept ANY token for MVP ease or use env var
    if (mode === 'subscribe') {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

router.post('/webhook', async (req, res) => {
    const body = req.body;
    // Basic Cloud API Parsing
    if (body.object) {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages && messages[0]) {
            const msg = messages[0];
            // Helper to normalize content
            const normalizedMsg = {
                from: msg.from,
                text: msg.text,
                type: msg.type,
                contacts: value.contacts
            };
            await handleCloudMessage(normalizedMsg);
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
